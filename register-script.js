import { saveAuthState } from './auth-client.js';

const form = document.getElementById('registerForm');
if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const firstName = form.firstName.value.trim();
    const lastName = form.lastName.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value.trim();

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      alert(data.error || 'Registration failed');
      return;
    }

    saveAuthState(data.user, data.token);
    window.location.href = '/dashboard.html';
  });
}
