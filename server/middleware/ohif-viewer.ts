// server/middleware/ohif.js
import { createReadStream, existsSync, lstatSync } from "fs";
import { resolve } from "path";
import { sendStream } from "h3";

export default defineEventHandler((event) => {
  const url = getRequestURL(event);
  if (url.pathname.startsWith("/ohif")) {
    const filePath = resolve("public", url.pathname.slice(1));

    if (existsSync(filePath) && lstatSync(filePath).isFile()) {
      return sendStream(event, createReadStream(filePath));
    }

    // fallback to OHIF's index.html for SPA routing
    const indexPath = resolve("public/ohif/index.html");
    return sendStream(event, createReadStream(indexPath));
  }
});
