require('dotenv').config();
const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const supabaseRoutes = require('./supabase-routes');

const app = express();
const PORT = process.env.PORT || 3005;
const publicPath = path.join(__dirname, '..');

app.use(compression());
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, x-user-id, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

const topbarTemplate = fs.existsSync(path.join(publicPath, 'components', 'topbar', 'topbar.html'))
  ? fs.readFileSync(path.join(publicPath, 'components', 'topbar', 'topbar.html'), 'utf8')
  : '';
const topbarHeadMarkup = '<link rel="stylesheet" href="/components/topbar/topbar.css">\n<script src="/components/topbar/topbar.js"></script>';
const topbarBodyMarkup = topbarTemplate;

app.use(async (req, res, next) => {
  if (req.method !== 'GET') return next();
  if (req.path.startsWith('/api') || req.path === '/topbar-config.js') return next();
  const isHtml = req.path === '/' || req.path.endsWith('.html');
  if (!isHtml) return next();

  const targetPath = req.path === '/'
    ? path.join(publicPath, 'index.html')
    : path.join(publicPath, decodeURIComponent(req.path));

  if (!targetPath.startsWith(publicPath)) return next();
  if (!fs.existsSync(targetPath)) return next();

  let html = fs.readFileSync(targetPath, 'utf8');
  if (topbarHeadMarkup && /<\/head>/i.test(html)) {
    const hasTopbarCss = /<link[^>]+topbar\.css/i.test(html);
    const hasTopbarScript = /<script[^>]+topbar\.js/i.test(html);
    if (!hasTopbarCss || !hasTopbarScript) {
      html = html.replace(/<\/head>/i, `${topbarHeadMarkup}\n</head>`);
    }
  }
  if (topbarBodyMarkup && /<body[^>]*>/i.test(html)) {
    const hasTopbar = /id=["']top-info-bar["']/i.test(html) || /class=["']topbar["']/i.test(html);
    if (!hasTopbar) {
      html = html.replace(/<body([^>]*)>/i, `<body$1>\n${topbarBodyMarkup}`);
    }
  }

  res.set('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
});

app.use('/api', supabaseRoutes);
app.use(express.static(publicPath));

app.get('/topbar-config.js', (req, res) => {
  const newsdataApiKey = process.env.NEWDATA_API_KEY || '';
  const mediastackApiKey = process.env.MEDIASTACK_API_KEY || '';
  const defaultCityName = process.env.TOPBAR_DEFAULT_CITY_NAME || 'Nairobi';
  const defaultLat = parseFloat(process.env.TOPBAR_DEFAULT_LAT) || -1.286389;
  const defaultLon = parseFloat(process.env.TOPBAR_DEFAULT_LON) || 36.817223;

  const payload = `window.TOPBAR_CONFIG = window.TOPBAR_CONFIG || {` +
    `newsdataApiKey: ${JSON.stringify(newsdataApiKey)},` +
    `mediastackApiKey: ${JSON.stringify(mediastackApiKey)},` +
    `defaultCity: ${JSON.stringify({ name: defaultCityName, lat: defaultLat, lon: defaultLon })}` +
  `};`;

  res.set('Content-Type', 'application/javascript; charset=utf-8');
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.send(payload);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✨ COUSERIASEMOR server is running at http://0.0.0.0:${PORT}`);
  console.log(`🌐 Network access: http://YOUR_IP_ADDRESS:${PORT}`);
});
