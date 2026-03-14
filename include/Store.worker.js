function fromJson(jsonString) {
    return JSON.parse(jsonString, function (key, value) {
        if (typeof value === 'string') {
            if (value.startsWith('/Function(') && value.endsWith(')/')) {
                value = value.substring(10, value.length - 2);
                return eval('(' + value + ')');
            }
            if (value.startsWith('@function:')) {
                value = value.substring(10, value.length);
                return eval('(' + value + ')');
            }
        }
        return value;
    });
}

function dottApi(root, path, value) {
    if (typeof path !== "string") throw new Error("path must be string");
    // Tokenizer: dot segments + bracket segments
    const tokens = [];
    path.replace(/\[(.*?)\]|[^.\[\]]+/g, (m, inner) => {
        if (inner !== undefined) {
            if (/^\d+$/.test(inner)) {
                tokens.push({
                    key: Number(inner),
                    isIndex: true
                }); // numeric index
            } else {
                tokens.push({
                    key: inner.replace(/^["']|["']$/g, ""),
                    isIndex: false
                });
            }
        } else {
            tokens.push({
                key: m,
                isIndex: false
            });
        }
    });
    let curr = root;
    // ---- SETTER ----
    if (arguments.length === 3) {
        for (let i = 0; i < tokens.length - 1; i++) {
            const t = tokens[i];
            const next = tokens[i + 1];
            if (curr[t.key] === undefined) {
                // Create array only if next token came from numeric bracket
                curr[t.key] = next.isIndex ? [] : {};
            }
            curr = curr[t.key];
            if (curr === null || typeof curr !== "object") throw new Error(`'${t.key}' is not an object`);
        }
        const last = tokens[tokens.length - 1];
        curr[last.key] = value;
        return value;
    }
    // ---- GETTER ----
    for (let i = 0; i < tokens.length; i++) {
        const t = tokens[i];
        if (curr == null || !(t.key in curr)) return undefined;
        curr = curr[t.key];
    }
    return curr;
}


const stores = Object.create(null);
//a map
// stores[name] = { type, data, owner, clients:Set, clientPorts:Map }

const allPorts = new Set();

const console = {
    log:   (...a) => allPorts.forEach(p => p.postMessage({ event: "log", level: "log",   data: ["[Worker] ", ...a] })),
    error: (...a) => allPorts.forEach(p => p.postMessage({ event: "log", level: "error", data: ["[Worker] ", ...a] })),
    warn:  (...a) => allPorts.forEach(p => p.postMessage({ event: "log", level: "warn",  data: ["[Worker] ", ...a] }))
};

onconnect = e => {
    const port = e.ports[0];
    allPorts.add(port);
    const portId = crypto.randomUUID();

    port.onmessage = evt => {
        const { id, method, args, client } = evt.data;

        if (method === "disconnect") {
            api.disconnect(args, client, port, portId);
            return; // fire-and-forget, no response
        }

        try {
            const result = api[method](args, client, port, portId);
            port.postMessage({ id, data: result });
        } catch (err) {
            port.postMessage({ id, error: err && err.message ? err.message : err });
        }
    };
};

function trigger(store, event, data) {
    store.clients.forEach(p => p.postMessage({ event, data }));
}

function bindClient(store, client, port, portId) {
    if (!client) throw new Error("client is required");
    if (!port) throw new Error("port is required");

    if (store.allowedClients !== false && !store.allowedClients.includes(client)) {
        throw new Error(`client "${client}" is not allowed in Store "${store.name}"`);
    }

    const existingPortId = store.clientPorts.get(client);

    if (existingPortId && existingPortId !== portId) {
        throw new Error(`client spoofing detected in Store "${store.name}": "${client}"`);
    }

    if (!existingPortId) {
        store.clientPorts.set(client, portId);
    }

    if (!store.clients.has(port)) {
        store.clients.add(port);
    }
}

const api = {

    // args = [name, type, allowedClients, onWorkerChangeSrc, beforeWorkerEndSrc]
    create([name, type, allowedClients, onWorkerChangeSrc, beforeWorkerEndSrc], client, port, portId) {
        let s = stores[name];
        const isNew = !s;

        if (isNew) {
            s = stores[name] = {
                name,
                type,
                data: type === "array" ? [] : {},
                owner: client,
                allowedClients: Array.isArray(allowedClients) ? allowedClients : false,
                onWorkerChange: onWorkerChangeSrc ? fromJson(onWorkerChangeSrc) : null,
                beforeWorkerEnd: beforeWorkerEndSrc ? fromJson(beforeWorkerEndSrc) : null,
                clients: new Set(),
                clientPorts: new Map()
            };
            trigger(s, "created", { name, type, owner: client });
        }

        bindClient(s, client, port, portId);

        return { created: isNew };
    },

    // args = [name, key, value] — key is required
    set([name, key, value], client, port, portId) {
        const s = stores[name];
        if (!s) throw new Error(`Store "${name}" does not exist.`);

        bindClient(s, client, port, portId);

        let prev;
        try { prev = dottApi(s.data, key); } catch { prev = undefined; }
        dottApi(s.data, key, value);
        const eventName = prev === undefined ? "created" : "changed";
        trigger(s, eventName, { name, key, value, client });
        if (s.onWorkerChange) try { s.onWorkerChange(key, value, client); } catch (e) { console.error("onWorkerChange error:", e); }
        return true;
    },

    // args = [name, data] — replaces root, must match store type
    setRoot([name, data], client, port, portId) {
        const s = stores[name];
        if (!s) throw new Error(`Store "${name}" does not exist.`);

        bindClient(s, client, port, portId);

        const isArray = Array.isArray(data);
        if (s.type === "array" && !isArray) throw new Error(`Store "${name}" is type "array" — cannot setRoot with an object`);
        if (s.type === "object" && isArray) throw new Error(`Store "${name}" is type "object" — cannot setRoot with an array`);

        s.data = data;
        trigger(s, "changed", { name, key: null, value: data, client });
        if (s.onWorkerChange) try { s.onWorkerChange(null, data, client); } catch (e) { console.error("onWorkerChange error:", e); }
        return true;
    },

    // args = [name, key] — key omitted returns root as-is (array, object, whatever)
    get([name, key], client, port, portId) {
        const s = stores[name];
        if (!s) return undefined;
        bindClient(s, client, port, portId);
        if (key === undefined || key === null) return s.data;
        return dottApi(s.data, String(key));
    },

    // args = [name, key] — removes a key from object, or splices element from array by numeric index
    delete([name, key], client, port, portId) {
        const s = stores[name];
        if (!s) throw new Error(`Store "${name}" does not exist.`);
        bindClient(s, client, port, portId);

        const k = String(key);
        let deleted;

        if (Array.isArray(s.data) && /^\d+$/.test(k)) {
            deleted = s.data[Number(k)];
            s.data.splice(Number(k), 1);
        } else {
            const tokens = [];
            k.replace(/\[(.*?)\]|[^.\[\]]+/g, function (m, inner) {
                if (inner !== undefined) {
                    tokens.push(/^\d+$/.test(inner) ? Number(inner) : inner.replace(/^["']|["']$/g, ""));
                } else {
                    tokens.push(m);
                }
            });
            let curr = s.data;
            for (let i = 0; i < tokens.length - 1; i++) {
                if (curr == null || typeof curr !== "object") return false;
                curr = curr[tokens[i]];
            }
            if (curr != null && typeof curr === "object") {
                const lastKey = tokens[tokens.length - 1];
                deleted = curr[lastKey];
                if (Array.isArray(curr) && typeof lastKey === "number") {
                    curr.splice(lastKey, 1);
                } else {
                    delete curr[lastKey];
                }
            }
        }

        trigger(s, "deleted", { name, key, value: deleted, client });
        if (s.onWorkerChange) try { s.onWorkerChange(key, deleted, client); } catch (e) { console.error("onWorkerChange error:", e); }
        return true;
    },

    // args = [name, key, value] — if target is array: push; if object: add key = keys.length.toString()
    append([name, key, value], client, port, portId) {
        const s = stores[name];
        if (!s) throw new Error(`Store "${name}" does not exist.`);
        bindClient(s, client, port, portId);

        const target = key == null ? s.data : dottApi(s.data, String(key));
        let writtenKey;
        if (Array.isArray(target)) {
            writtenKey = target.length; // index it will land at
            target.push(value);
        } else if (target !== null && typeof target === "object") {
            writtenKey = Object.keys(target).length.toString();
            target[writtenKey] = value;
        } else {
            throw new Error(`append: target at "${key}" is not an array or object`);
        }

        trigger(s, "created", { name, key, value, client });
        if (s.onWorkerChange) try { s.onWorkerChange(key, value, client); } catch (e) { console.error("onWorkerChange error:", e); }
        return writtenKey;
    },

    // args = [name, key, value] — if target is array: unshift; if object: reconstruct with new key first
    prepend([name, key, value], client, port, portId) {
        const s = stores[name];
        if (!s) throw new Error(`Store "${name}" does not exist.`);
        bindClient(s, client, port, portId);

        const target = key == null ? s.data : dottApi(s.data, String(key));
        let writtenKey;
        if (Array.isArray(target)) {
            writtenKey = 0;
            target.unshift(value);
        } else if (target !== null && typeof target === "object") {
            writtenKey = Object.keys(target).length.toString();
            const rebuilt = { [writtenKey]: value };
            Object.assign(rebuilt, target);
            if (key == null) {
                s.data = rebuilt;
            } else {
                dottApi(s.data, String(key), rebuilt);
            }
        } else {
            throw new Error(`prepend: target at "${key}" is not an array or object`);
        }

        trigger(s, "created", { name, key, value, client });
        if (s.onWorkerChange) try { s.onWorkerChange(key, value, client); } catch (e) { console.error("onWorkerChange error:", e); }
        return writtenKey;
    },

    // args = [name, key, value] — finds the index/key of value inside the array or object at key
    indexOf([name, key, value], client, port, portId) {
        const s = stores[name];
        if (!s) throw new Error(`Store "${name}" does not exist.`);
        bindClient(s, client, port, portId);

        const target = key == null ? s.data : dottApi(s.data, String(key));
        if (Array.isArray(target)) {
            return target.indexOf(value);
        } else if (target !== null && typeof target === "object") {
            for (const k of Object.keys(target)) {
                if (target[k] === value) return k;
            }
            return -1;
        } else {
            const type = target === null ? "null" : typeof target;
            throw new Error(`cant get index of a type:${type}`);
        }
    },

    // args = [name] — removes this port from store.clients so stale ports don't accumulate
    disconnect([name], client, port) {
        const s = stores[name];
        if (!s) return;
        s.clients.delete(port);
        s.clientPorts.delete(client);
        allPorts.delete(port);
        // last client left — fire beforeWorkerEnd (last chance to persist)
        if (s.clients.size === 0 && s.beforeWorkerEnd) {
            try { s.beforeWorkerEnd(s.data); } catch (e) { console.error("beforeWorkerEnd error:", e); }
        }
    }
};
