function checkAdminAuth() {
    const token = localStorage.getItem('adminToken');
    const currentPage = window.location.pathname.split('/').pop();
    
    if (!token && currentPage !== 'login.html') {
        window.location.href = 'login.html';
    }
    if (token && currentPage === 'login.html') {
        window.location.href = 'dashboard.html';
    }
}

function logout() {
    localStorage.removeItem('adminToken');
    window.location.href = 'login.html';
}

checkAdminAuth();
