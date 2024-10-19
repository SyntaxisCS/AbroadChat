import { createRequestHandler } from "@remix-run/express";
import compression from "compression";
import express from "express";

// Create vite dev server if in development
const viteDevServer =
    process.env.NODE_ENV === "production"
        ? null
        : await import("vite").then((vite) =>
            vite.createServer({
                server: { middlewareMode: true },
            })
        );

// Create express server
const app = express();

// Serve client files in prod or vite middlewares
app.use(viteDevServer ? viteDevServer.middlewares : express.static("build/client"));

// Serve server files in prod or vite dev server
const build = viteDevServer ? () => viteDevServer.ssrLoadModule("virtual:remix/server-build") : await import("./build/server/index.js");
// Vite Dev Server

// Compression
const shouldCompress = async (req, res) => {
    if (req.headers["x-no-compression"]) {
        return false;
    }

    // fallback to standard filter function
    return compression.filter(req, res);
};

app.use(compression({filter: shouldCompress}));
// Compression

// Request Handler
app.all("*", createRequestHandler({ build }));

const port = process.env.port || 9801;

app.listen(port, () => {
    console.info(`App listening on http://localhost:${port}`);
});