import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const root = path.dirname(fileURLToPath(import.meta.url));
const assetRoot = path.resolve(root, "../storycomet.app/storycomet.app.mirror/api.storycomet.app/storage/v1/object/public/story-assets");
const types = { ".webp": "image/webp", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".glb": "model/gltf-binary" };

function storyAssets() {
  return {
    name: "story-assets",
    configureServer(server) {
      server.middlewares.use("/story-assets", (req, res, next) => {
        const rel = decodeURIComponent((req.url || "/").split("?")[0]).replace(/^\/+/, "");
        const file = path.resolve(assetRoot, rel);
        if (!file.startsWith(assetRoot) || !fs.existsSync(file) || !fs.statSync(file).isFile()) return next();
        res.setHeader("Content-Type", types[path.extname(file).toLowerCase()] || "application/octet-stream");
        res.setHeader("Cache-Control", "public, max-age=604800");
        fs.createReadStream(file).pipe(res);
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), storyAssets()],
  server: {
    host: "127.0.0.1",
    port: 8090,
    strictPort: true,
    fs: { allow: [root, path.resolve(root, "..")] },
  },
});
