const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

const LINKS_FILE = path.join(__dirname, 'links.json');

// Middleware to parse JSON
app.use(express.json());

// Serve static files from 'public' directory
app.use(express.static('public'));

// Get links
app.get('/api/links', async (req, res) => {
  try {
    const data = await fs.readFile(LINKS_FILE, 'utf8');
    const links = JSON.parse(data);
    res.json(links);
  } catch (error) {
    // If file doesn't exist, return empty array
    res.json([]);
  }
});

// Save links
app.post('/api/links', async (req, res) => {
  try {
    const links = req.body;
    await fs.writeFile(LINKS_FILE, JSON.stringify(links, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save links' });
  }
});

app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`);
});