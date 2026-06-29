import { requireAuth, fetchUserInfo } from './auth-client.js';

const auth = requireAuth();
const container = document.getElementById('dashboardContent');
if (!container) throw new Error('Dashboard content area not found');

(async () => {
  const user = await fetchUserInfo();
  if (!user) {
    container.innerHTML = '<p>Unable to load your profile.</p>';
    return;
  }

  container.innerHTML = `
    <div class="card">
      <h2>Welcome, ${user.first_name || user.email}</h2>
      <p>Your email: ${user.email}</p>
      <p>Total points: ${user.total_points || 0}</p>
    </div>
    <div class="card">
      <h3>Your progress</h3>
      <p>Track your courses and achievements here.</p>
    </div>
  `;
})();
