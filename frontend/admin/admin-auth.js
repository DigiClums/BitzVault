function checkAdminAuth() {
    const token = localStorage.getItem('adminToken');
    const expiresAt = Number(localStorage.getItem('adminTokenExpiresAt') || 0);
    const currentPage = window.location.pathname.split('/').pop();
    const isExpired = !expiresAt || Date.now() > expiresAt;
    
    if ((!token || isExpired) && currentPage !== 'login.html') {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminTokenExpiresAt');
        window.location.href = 'login.html';
    }
    if (token && !isExpired && currentPage === 'login.html') {
        window.location.href = 'dashboard.html';
    }
}

function logout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminTokenExpiresAt');
    window.location.href = 'login.html';
}

checkAdminAuth();
