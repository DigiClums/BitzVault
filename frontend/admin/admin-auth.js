function isAdminPage(page) {
  return page !== 'login.html';
}

function clearAdminSession() {
  localStorage.removeItem('adminToken');
}

function checkAdminAuth() {
  const token = localStorage.getItem('adminToken');
  const page = window.location.pathname.split('/').pop();

  if (!token && isAdminPage(page)) {
    window.location.href = 'login.html';
    return;
  }

  if (token && page === 'login.html') {
    window.location.href = 'dashboard.html';
  }
}

function logout() {
  clearAdminSession();
  window.location.href = 'login.html';
}

checkAdminAuth();
