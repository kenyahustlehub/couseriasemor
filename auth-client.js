const authStorageKey = 'couseriasemor_auth';

export function saveAuthState(user, token) {
  localStorage.setItem(authStorageKey, JSON.stringify({ user, token }));
}

export function clearAuthState() {
  localStorage.removeItem(authStorageKey);
}

export function getAuthState() {
  const stored = localStorage.getItem(authStorageKey);
  return stored ? JSON.parse(stored) : null;
}

export function requireAuth() {
  const auth = getAuthState();
  if (!auth?.token) {
    window.location.href = '/login.html';
    return null;
  }
  return auth;
}

export function renderAuthNav() {
  const auth = getAuthState();
  const nav = document.querySelector('.auth-nav');
  if (!nav) return;

  if (auth?.user) {
    nav.innerHTML = `
      <span>Hi ${auth.user.firstName || auth.user.email}</span>
      <a href="/dashboard.html">Dashboard</a>
      <button id="logoutButton">Logout</button>
    `;
    document.getElementById('logoutButton')?.addEventListener('click', () => {
      clearAuthState();
      window.location.href = '/login.html';
    });
  } else {
    nav.innerHTML = `
      <a href="/login.html">Login</a>
      <a href="/register.html">Register</a>
    `;
  }
}

export async function fetchUserInfo() {
  const auth = getAuthState();
  if (!auth?.token) return null;
  const response = await fetch('/api/user/profile', {
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': auth.user.id,
      Authorization: `Bearer ${auth.token}`,
    },
  });
  if (!response.ok) return null;
  return response.json();
}
