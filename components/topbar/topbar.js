// topbar.js
// Handles weather via Open-Meteo and live news ticker using NewsData.org and Mediastack.

const WEATHER_REFRESH_MS = 10 * 60 * 1000;
const NEWS_REFRESH_MS = 15 * 60 * 1000;
const DEFAULT_CITY = {
  name: 'Nairobi',
  lat: -1.286389,
  lon: 36.817223
};

function fetchWithTimeout(url, options = {}, timeout = 8000) {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Request timeout')), timeout))
  ]);
}

async function getCoords() {
  if (navigator.geolocation) {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
      });
      return {
        lat: position.coords.latitude,
        lon: position.coords.longitude
      };
    } catch {
      // fallback to default
    }
  }
  return { lat: DEFAULT_CITY.lat, lon: DEFAULT_CITY.lon };
}

function weatherCodeToIcon(code) {
  if (code === 0) return '☀';
  if (code <= 3) return '⛅';
  if (code <= 48) return '🌫';
  if (code <= 57) return '🌧';
  if (code <= 67) return '❄';
  if (code <= 77) return '🌨';
  if (code <= 82) return '🌧';
  if (code <= 86) return '⛈';
  return '☁';
}

async function fetchWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m&timezone=auto&windspeed_unit=kmh`;
  const response = await fetchWithTimeout(url);
  if (!response.ok) throw new Error('Weather API returned an error');
  return response.json();
}

function findClosestIndex(times, target) {
  const targetMs = target.getTime();
  let best = 0;
  let bestDiff = Infinity;
  times.forEach((time, index) => {
    const diff = Math.abs(new Date(time).getTime() - targetMs);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = index;
    }
  });
  return best;
}

async function updateWeather() {
  const iconEl = document.getElementById('weather-icon');
  const tempEl = document.getElementById('weather-temp');
  const cityEl = document.getElementById('weather-city');
  const humidityEl = document.getElementById('weather-humidity');
  const windEl = document.getElementById('weather-wind');
  const timeEl = document.getElementById('weather-time');

  try {
    const coords = await getCoords();
    const data = await fetchWeather(coords.lat, coords.lon);
    const current = data.current_weather || {};
    const icon = weatherCodeToIcon(current.weathercode ?? 0);
    const temp = current.temperature != null ? `${Math.round(current.temperature)}°C` : '--°C';
    const wind = current.windspeed != null ? `${Math.round(current.windspeed)} km/h` : '-- km/h';

    let humidityValue = '--';
    if (data.hourly && data.hourly.time && data.hourly.relativehumidity_2m) {
      const index = findClosestIndex(data.hourly.time, new Date());
      const humidity = data.hourly.relativehumidity_2m[index];
      humidityValue = humidity != null ? `${Math.round(humidity)}%` : '--';
    }

    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    iconEl.textContent = icon;
    tempEl.textContent = temp;
    cityEl.textContent = DEFAULT_CITY.name;
    humidityEl.textContent = `💧 ${humidityValue}`;
    windEl.textContent = `🌬 ${wind}`;
    timeEl.textContent = `🕒 ${timeString}`;
  } catch (error) {
    iconEl.textContent = '☀';
    tempEl.textContent = 'N/A';
    humidityEl.textContent = '💧 N/A';
    windEl.textContent = '🌬 N/A';
    timeEl.textContent = '🕒 --:--';
  }
}

async function fetchNewsData() {
  const key = window.TOPBAR_CONFIG?.newsdataApiKey || '';
  if (!key) throw new Error('Missing NewsData API key');
  const url = `https://newsdata.io/api/1/news?apikey=${encodeURIComponent(key)}&language=en`;
  const response = await fetchWithTimeout(url);
  if (!response.ok) throw new Error('NewsData failed');
  const data = await response.json();
  if (!data.results) throw new Error('NewsData response invalid');
  return data.results.map(item => ({ title: item.title, link: item.link || item.source_id || '#' }));
}

async function fetchMediastack() {
  const key = window.TOPBAR_CONFIG?.mediastackApiKey || '';
  if (!key) throw new Error('Missing Mediastack API key');
  const url = `http://api.mediastack.com/v1/news?access_key=${encodeURIComponent(key)}&languages=en&categories=technology,sports,business,entertainment,general`;
  const response = await fetchWithTimeout(url);
  if (!response.ok) throw new Error('Mediastack failed');
  const data = await response.json();
  if (!data.data) throw new Error('Mediastack response invalid');
  return data.data.map(item => ({ title: item.title, link: item.url || '#' }));
}

function fallbackHeadlines() {
  return [
    { title: 'Live news currently unavailable — check back soon.', link: '#' },
    { title: 'Set your NewsData.org and Mediastack keys in .env for real headlines.', link: '#' },
    { title: 'Weather data works without a key via Open-Meteo.', link: '#' }
  ];
}

async function fetchNews() {
  try {
    return await fetchNewsData();
  } catch {
    try {
      return await fetchMediastack();
    } catch {
      return fallbackHeadlines();
    }
  }
}

let tickerId = null;
let lastFrame = null;
let pausedUntil = 0;
let position = 0;
const speed = 60;

function createTickerItems(headlines) {
  const track = document.getElementById('ticker-track');
  track.innerHTML = '';

  const createItem = (headline) => {
    const item = document.createElement('div');
    item.className = 'ticker-item';
    const badge = document.createElement('span');
    badge.className = 'live-badge';
    badge.textContent = 'LIVE';
    const link = document.createElement('a');
    link.className = 'headline';
    link.textContent = headline.title;
    link.href = headline.link || '#';
    link.target = '_blank';
    link.rel = 'noopener';
    item.appendChild(badge);
    item.appendChild(link);
    return item;
  };

  headlines.forEach(headline => track.appendChild(createItem(headline)));
  headlines.forEach(headline => track.appendChild(createItem(headline)));
}

function setupTickerObserver() {
  const container = document.getElementById('news-ticker');
  const items = Array.from(document.querySelectorAll('#ticker-track .ticker-item'));
  const observer = new IntersectionObserver((entries) => {
    const now = performance.now();
    entries.forEach(entry => {
      if (entry.isIntersecting && now > pausedUntil) {
        pausedUntil = now + 2500;
      }
    });
  }, { root: container, threshold: 0.9 });
  items.forEach(item => observer.observe(item));
}

function animateTicker(timestamp) {
  if (!lastFrame) lastFrame = timestamp;
  const delta = (timestamp - lastFrame) / 1000;
  lastFrame = timestamp;

  if (performance.now() < pausedUntil) {
    tickerId = requestAnimationFrame(animateTicker);
    return;
  }

  const track = document.getElementById('ticker-track');
  const trackWidth = track.scrollWidth;
  if (!trackWidth) return;

  position -= speed * delta;
  if (Math.abs(position) >= trackWidth / 2) {
    position = 0;
  }
  track.style.transform = `translateX(${position}px)`;
  tickerId = requestAnimationFrame(animateTicker);
}

function startTicker() {
  if (tickerId) cancelAnimationFrame(tickerId);
  lastFrame = null;
  tickerId = requestAnimationFrame(animateTicker);
}

async function refreshTopbar() {
  await updateWeather();
  const headlines = await fetchNews();
  createTickerItems(headlines);
  setupTickerObserver();
  startTicker();
}

function initTopbar() {
  refreshTopbar();
  setInterval(updateWeather, WEATHER_REFRESH_MS);
  setInterval(refreshTopbar, NEWS_REFRESH_MS);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTopbar);
} else {
  initTopbar();
}
