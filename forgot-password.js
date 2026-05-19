document.getElementById('forgotForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const messageDiv = document.getElementById('message');

    if (!email) {
        showMessage('Please enter the email address you registered with.', 'error');
        return;
    }

    try {
        const response = await fetch('/api/password-reset/request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (response.ok) {
            showMessage(`✅ ${data.message}`, 'success');
            const resetContainer = document.getElementById('resetCodeContainer');
            const resetText = document.getElementById('resetCodeText');
            if (resetContainer && resetText) {
                resetText.textContent = data.resetCode;
                resetContainer.classList.remove('hidden');
            }
        } else {
            hideResetCode();
            showMessage(data.message || 'We could not find your account. Double-check your email and try again, or sign up if you are new.', 'error');
        }
    } catch (error) {
        showMessage('Oops! Something went wrong. Please try again in a moment.', 'error');
    }
});

async function copyResetCode() {
    const resetText = document.getElementById('resetCodeText');
    if (!resetText) return;

    try {
        await navigator.clipboard.writeText(resetText.textContent || '');
        showMessage('Code copied to clipboard. Paste it on the reset page to continue.', 'success');
    } catch {
        showMessage('Copy failed. Select the code and copy it manually.', 'warning');
    }
}

function hideResetCode() {
    const resetContainer = document.getElementById('resetCodeContainer');
    if (resetContainer) {
        resetContainer.classList.add('hidden');
    }
}

function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.innerHTML = message;
    messageDiv.className = 'message ' + type;
}

document.addEventListener('DOMContentLoaded', () => {
    const copyButton = document.getElementById('copyResetCode');
    if (copyButton) {
        copyButton.addEventListener('click', (e) => {
            e.preventDefault();
            copyResetCode();
        });
    }
    hideResetCode();
});
