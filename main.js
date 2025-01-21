#!/usr/bin/env node

import express from 'express';
import cors from 'cors';
import open from 'open';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';
import "colors"

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3001;

// Path for storing accounts data
const ACCOUNTS_FILE = join(__dirname, 'accounts.json');

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Initialize accounts file if it doesn't exist
async function initializeAccountsFile() {
    try {
        await fs.access(ACCOUNTS_FILE);
    } catch {
        await fs.writeFile(ACCOUNTS_FILE, JSON.stringify({ accounts: [] }));
    }
}

// Save account endpoint
app.post('/save', async (req, res) => {
    try {
        const { input, type } = req.body;
        if (!input || !type || !['privateKey', 'seedPhrase'].includes(type)) {
            return res.status(400).json({ error: 'Invalid account data' });
        }

        // Read existing accounts
        let data;
        try {
            const fileContent = await fs.readFile(ACCOUNTS_FILE, 'utf-8');
            data = JSON.parse(fileContent);
        } catch {
            data = { accounts: [] };
        }

        // Add new account
        data.accounts.push({ input, type });

        // Save updated accounts
        await fs.writeFile(ACCOUNTS_FILE, JSON.stringify(data, null, 2));
        res.json({ success: true });
    } catch (error) {
        console.error('Error saving account:', error);
        res.status(500).json({ error: 'Failed to save account' });
    }
});

// Restore accounts endpoint
app.get('/restore', async (req, res) => {
    try {
        const data = await fs.readFile(ACCOUNTS_FILE, 'utf-8');
        res.json(JSON.parse(data));
    } catch (error) {
        console.error('Error restoring accounts:', error);
        res.status(500).json({ error: 'Failed to restore accounts' });
    }
});

// Serve static files from dist directory
app.use(express.static(join(__dirname, 'dist')));

// Initialize accounts file when server starts
initializeAccountsFile().catch(console.error);

// Fallback for SPA routing - serve index.html for all routes
app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`.green);
    // Open the browser automatically
    open(`http://localhost:${PORT}`);
});
