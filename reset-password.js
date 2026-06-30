const getApiUrl = (path) => {
    const isLocalPreview = window.location.hostname === '127.0.0.1' && window.location.port === '3000';
    return isLocalPreview ? `http://127.0.0.1:3005${path}` : path;
};

document.getElementById('resetForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const resetCode = document.getElementById('resetCode').value.trim();
    const newPassword = document.getElementById('newPassword').value.trim();

    if (!email || !resetCode || !newPassword) {
        showMessage('All fields are required to reset your password.', 'error');
        return;
    }

    if (newPassword.length < 6) {
        showMessage('Your password must be at least 6 characters long.', 'error');
        return;
    }

    try {
        const response = await fetch(getApiUrl('/api/password-reset/confirm'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, token: resetCode, password: newPassword }),
        });

        const data = await response.json();

        if (response.ok) {
            showMessage(data.message || 'Password updated successfully. You can now log in with your new password.', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2200);
        } else {
            showMessage(data.message || 'Unable to reset your password. Please check your email and reset code, then try again.', 'error');
        }
    } catch (error) {
        showMessage('Something went wrong while updating your password. Please try again.', 'error');
    }
});

function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.innerHTML = message;
    messageDiv.className = 'message ' + type;
}
