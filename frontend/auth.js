function checkAuth() {
  const token = localStorage.getItem('token');
  const publicPages = ['login.html', 'register.html'];
  const currentPage = window.location.pathname.split('/').pop();
  
  if (!token && !publicPages.includes(currentPage)) {
    window.location.href = 'login.html';
  }
  if (token && publicPages.includes(currentPage)) {
    window.location.href = 'index.html';
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  window.location.href = 'login.html';
}

checkAuth();
