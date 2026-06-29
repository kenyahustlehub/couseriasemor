import { requireAuth } from './auth-client.js';
requireAuth();

const container = document.querySelector('.page-shell');
if (container) {
  const premiumSection = document.createElement('section');
  premiumSection.className = 'card';
  premiumSection.innerHTML = `
    <h2>Premium features</h2>
    <p>This section is available to premium plan users.</p>
  `;
  container.appendChild(premiumSection);
}
