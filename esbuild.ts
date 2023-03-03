import esbuild from "esbuild";

esbuild.build({
    entryPoints: ["src/index.ts"],
    bundle: true,
    sourcemap: true,
    minify: true,
    outfile: "dist/index.js",
    platform: "node",
});
