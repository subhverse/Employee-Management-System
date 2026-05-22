// Login page logic
document.addEventListener('DOMContentLoaded', function () {
  // If already logged in, go to dashboard
  if (isLoggedIn()) {
    window.location.href = 'dashboard.html';
    return;
  }

  const loginForm = document.getElementById('loginForm');
  const loginBtn = document.getElementById('loginBtn');
  const errorMsg = document.getElementById('loginError');

  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    errorMsg.textContent = '';
    errorMsg.classList.remove('show');

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Simple client-side validation
    if (!email || !password) {
      showError('Please enter email and password');
      return;
    }

    if (!email.includes('@')) {
      showError('Please enter a valid email');
      return;
    }

    loginBtn.disabled = true;
    loginBtn.textContent = 'Signing in...';

    try {
      const data = await login(email, password);
      saveAuth(data.token, data.admin.email);
      showToast('Login successful! Redirecting...', 'success');
      setTimeout(function () {
        window.location.href = 'dashboard.html';
      }, 800);
    } catch (err) {
      showError(err.message);
      loginBtn.disabled = false;
      loginBtn.textContent = 'Sign In';
    }
  });

  function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.classList.add('show');
  }
});

// Toast notification (used on login page too)
function showToast(message, type) {
  type = type || 'info';
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(function () {
    toast.classList.add('fade-out');
    setTimeout(function () {
      toast.remove();
    }, 300);
  }, 3000);
}
