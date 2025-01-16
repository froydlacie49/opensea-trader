#!/usr/bin/env node

import { createServer } from "vite";
import open from "open"; // Import the `open` package
import "colors";
import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function startServer() {
    try {
        // Start the account storage server
        const accountServer = spawn('node', [join(__dirname, 'src/server/accountServer.js')], {
            stdio: 'inherit'
        });

        accountServer.on('error', (err) => {
            console.error('Failed to start account storage server:', err);
        });

        // Start the Vite dev server
        const server = await createServer();
        await server.listen();

        const port = server.config.server.port || 5173; // Default Vite port is 5173
        const url = `http://localhost:${port}`;

        console.log(`Vite development server is running at ${url}`.green);

        // Open the browser automatically
        await open(url);

        // Handle cleanup on exit
        const cleanup = () => {
            accountServer.kill();
            server.close();
            process.exit();
        };

        process.on('SIGINT', cleanup);
        process.on('SIGTERM', cleanup);
    } catch (error) {
        console.error("Error starting Vite:".red, error);
    }
}

startServer();
