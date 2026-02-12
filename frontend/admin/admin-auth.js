function checkAdminAuth() {
  const token = localStorage.getItem('adminToken');
  const page = window.location.pathname.split('/').pop();

  if (!token && page !== 'login.html') {
    window.location.href = 'login.html';
  }

  if (token && page === 'login.html') {
    window.location.href = 'dashboard.html';
  }
}

function logout() {
  localStorage.removeItem('adminToken');
  window.location.href = 'login.html';
}

checkAdminAuth();
