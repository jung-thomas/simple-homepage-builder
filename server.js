const express = require('express');
const puppeteer = require('puppeteer');
const sharp = require('sharp');
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

app.get('/screenshot', async (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).json({ error: 'URL parameter required' });
  }

  try {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    const screenshot = await page.screenshot({ type: 'png', fullPage: false });
    await browser.close();

    // Resize to 400x300
    const resized = await sharp(screenshot).resize(400, 300, { fit: 'cover' }).png().toBuffer();

    const base64 = resized.toString('base64');
    res.json({ image: `data:image/png;base64,${base64}` });
  } catch (error) {
    console.error('Screenshot error:', error);
    res.status(500).json({ error: 'Failed to take screenshot' });
  }
});

app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`);
});