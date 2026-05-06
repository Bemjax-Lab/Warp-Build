# API Router TODO

## Endpoint lifecycle events
Trigger events in all renderer tabs when endpoints change:
- `endpointRegistered` — when a new endpoint is added (name, methods)
- `endpointReady` — when endpoint's `_init` completes successfully
- `endpointRemoved` — when an endpoint is unregistered
- `endpointError` — when endpoint fails to load or init

Use `router.trigger()` to broadcast. Tabs can listen via `warp.on("endpointRegistered", ...)`.

This enables layouts/apps to react to backend availability changes without polling.
