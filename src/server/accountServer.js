import express from 'express';
import { promises as fs } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3001;  // Different from your main app port

// Enable CORS for your main app
app.use(cors());
app.use(express.json());

const ACCOUNTS_FILE = join(__dirname, '../../accounts.txt');

// Ensure the file exists
async function ensureFile() {
    try {
        await fs.access(ACCOUNTS_FILE);
    } catch {
        await fs.writeFile(ACCOUNTS_FILE, '', 'utf8');
    }
}

// Save account endpoint
app.post('/save', async (req, res) => {
    try {
        const { input, type } = req.body;
        if (!input || !type) {
            return res.status(400).json({ error: 'Missing input or type' });
        }

        await ensureFile();
        
        // Read existing accounts
        const content = await fs.readFile(ACCOUNTS_FILE, 'utf8');
        const accounts = new Set(content.split('\n').filter(line => line.trim()));
        
        // Add new account
        const accountLine = `${type}:${input}`;
        accounts.add(accountLine);
        
        // Save unique accounts back to file
        await fs.writeFile(ACCOUNTS_FILE, Array.from(accounts).join('\n'), 'utf8');
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error saving account:', error);
        res.status(500).json({ error: 'Failed to save account' });
    }
});

// Restore accounts endpoint
app.get('/restore', async (req, res) => {
    try {
        await ensureFile();
        
        const content = await fs.readFile(ACCOUNTS_FILE, 'utf8');
        const accounts = content
            .split('\n')
            .filter(line => line.trim())
            .map(line => {
                const [type, input] = line.split(':');
                return { type, input };
            });
        
        res.json({ accounts });
    } catch (error) {
        console.error('Error restoring accounts:', error);
        res.status(500).json({ error: 'Failed to restore accounts' });
    }
});

app.listen(port, () => {
    console.log(`Account storage server running on port ${port}`);
});
