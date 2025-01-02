#!/usr/bin/env node

import { createServer } from "vite";
import open from "open"; // Import the `open` package
import "colors";

async function startServer() {
    try {
        const server = await createServer();
        await server.listen();

        const port = server.config.server.port || 5173; // Default Vite port is 5173
        const url = `http://localhost:${port}`;

        console.log(`Vite development server is running at ${url}`.green);

        // Open the browser automatically
        await open(url);
    } catch (error) {
        console.error("Error starting Vite:".red, error);
    }
}

startServer();
