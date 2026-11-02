// Minimal static file server for local preview:  node server.mjs [port]
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, sep } from "node:path";

const root = process.cwd();
const port = Number(process.argv[2] || 4321);

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon"
};

createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    let path = decodeURIComponent(url.pathname);
    if (path.endsWith("/")) path += "index.html";

    const target = normalize(join(root, path));
    if (!target.startsWith(root + sep) && target !== root) {
      res.writeHead(403).end("Forbidden");
      return;
    }

    const info = await stat(target).catch(() => null);
    if (!info || !info.isFile()) {
      res.writeHead(404, { "content-type": "text/html; charset=utf-8" });
      res.end("<h1>404</h1>");
      return;
    }

    const body = await readFile(target);
    res.writeHead(200, {
      "content-type": types[extname(target).toLowerCase()] || "application/octet-stream",
      "cache-control": "no-cache"
    });
    res.end(body);
  } catch (err) {
    res.writeHead(500).end(String(err));
  }
}).listen(port, () => {
  console.log(`Hotel Rozenburg preview → http://localhost:${port}`);
});
