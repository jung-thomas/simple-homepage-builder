const express = require('express');
const puppeteer = require('puppeteer');
const sharp = require('sharp');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files from 'public' directory
app.use(express.static('public'));

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