import { requireAuth, fetchUserInfo } from './auth-client.js';

requireAuth();
const container = document.getElementById('profileCard');
if (!container) throw new Error('Profile card not found');

(async () => {
  const user = await fetchUserInfo();
  if (!user) {
    container.innerHTML = '<p>Unable to load your profile.</p>';
    return;
  }

  container.innerHTML = `
    <h2>${user.first_name || user.email}</h2>
    <p>Email: ${user.email}</p>
    <p>Joined: ${new Date(user.created_at).toLocaleDateString() || 'N/A'}</p>
  `;
})();
