import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import authHandler from "./api/auth.js";
import projectsHandler from "./api/projects.js";
import uploadHandler from "./api/upload.js";
import contactHandler from "./api/contact.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

function createApiMiddleware() {
  return async (req, res, next) => {
    const parsedUrl = new URL(req.url, "http://localhost");
    const pathname = parsedUrl.pathname;

    if (!pathname.startsWith("/api/")) {
      return next();
    }

    // Buffer and parse body for POST/PUT/PATCH/DELETE
    let body = {};
    if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
      const buffers = [];
      for await (const chunk of req) {
        buffers.push(chunk);
      }
      const raw = Buffer.concat(buffers).toString("utf-8");
      if (raw) {
        try {
          body = JSON.parse(raw);
        } catch {
          body = {};
        }
      }
    }
    req.body = body;

    // Express-like helper methods for serverless handlers
    res.status = function (code) {
      res.statusCode = code;
      return res;
    };
    res.json = function (data) {
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(data));
      return res;
    };

    try {
      if (pathname.startsWith("/api/auth")) {
        return await authHandler(req, res);
      }
      if (pathname.startsWith("/api/projects")) {
        return await projectsHandler(req, res);
      }
      if (pathname.startsWith("/api/upload")) {
        return await uploadHandler(req, res);
      }
      if (pathname.startsWith("/api/contact")) {
        return await contactHandler(req, res);
      }
      next();
    } catch (err) {
      console.error("API error in server middleware:", err);
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ success: false, message: err.message }));
    }
  };
}

function apiDevServerPlugin(env) {
  // Populate process.env with loaded env vars so serverless handlers can read them
  Object.assign(process.env, env);

  const middleware = createApiMiddleware();

  return {
    name: "api-dev-server-plugin",
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, "");

  return {
    server: {
      host: "0.0.0.0",
      port: 5173,
    },
    preview: {
      host: "0.0.0.0",
      port: 4173,
    },
    plugins: [
      react(),
      tailwindcss(),
      apiDevServerPlugin(env),
    ],
  };
});