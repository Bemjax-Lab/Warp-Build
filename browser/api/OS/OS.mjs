/* ──────────────────────────────────────────────────────────────
   OS endpoint — exposes platform and version info.
   Maps to warp.native.invoke("OS", methodName, args)
   ────────────────────────────────────────────────────────────── */

var OS = {

    async Info() {
        return {
            platform: process.platform,
            arch: process.arch,
            node: process.versions.node,
            chrome: process.versions.chrome,
            electron: process.versions.electron
        };
    }
};

export default OS;
