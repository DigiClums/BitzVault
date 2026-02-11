const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:3001/api'
    : 'https://bitzvault.onrender.com/api';

function setStatus(message, isError = false) {
    const statusEl = document.getElementById('adminStatus');
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.className = `status-banner ${isError ? 'error' : 'success'}`;
    statusEl.style.display = 'block';
}

function clearStatus() {
    const statusEl = document.getElementById('adminStatus');
    if (!statusEl) return;
    statusEl.style.display = 'none';
}

async function request(path, options = {}) {
    const response = await fetch(`${API_URL}${path}`, options);
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(data.message || 'Request failed');
    }
    return data;
}

function showSection(evt, sectionId) {
    clearStatus();
    document.querySelectorAll('.section').forEach((s) => s.classList.remove('active'));
    document.querySelectorAll('.sidebar nav a').forEach((a) => a.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    if (evt && evt.currentTarget) evt.currentTarget.classList.add('active');

    if (sectionId === 'dashboard') loadDashboard();
    if (sectionId === 'users') loadUsers();
    if (sectionId === 'transactions') loadTransactions();
    if (sectionId === 'mining') loadMining();
}

async function loadDashboard() {
    try {
        const stats = await request('/admin/stats');
        document.getElementById('totalUsers').textContent = stats.totalUsers;
        document.getElementById('totalBalance').textContent = stats.totalBalance.toFixed(2) + ' USDT';
        document.getElementById('totalTransactions').textContent = stats.totalTransactions;
        document.getElementById('totalMining').textContent = stats.totalMining;
    } catch (err) {
        setStatus(`Failed to load dashboard: ${err.message}`, true);
    }
}

async function loadUsers() {
    try {
        const users = await request('/admin/users');
        const tbody = document.getElementById('usersBody');
        tbody.innerHTML = users.map(u => `
            <tr>
                <td>${u.userId}</td>
                <td>${u.phone}</td>
                <td>${u.balance.toFixed(2)} USDT</td>
                <td>${u.inviteCode}</td>
                <td>
                    <button class="action-btn edit-btn" onclick="editUser('${u.userId}')">Edit</button>
                    <button class="action-btn delete-btn" onclick="deleteUser('${u.id}')">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        setStatus(`Failed to load users: ${err.message}`, true);
    }
}

async function loadTransactions() {
    try {
        const transactions = await request('/admin/transactions');
        const tbody = document.getElementById('transactionsBody');
        tbody.innerHTML = transactions.map(t => `
            <tr>
                <td>${t.type.toUpperCase()}</td>
                <td>${t.amount} USDT</td>
                <td>${t.status}</td>
                <td>${new Date(t.createdAt).toLocaleString()}</td>
                <td>
                    <button class="action-btn delete-btn" onclick="deleteTransaction('${t.id}')">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        setStatus(`Failed to load transactions: ${err.message}`, true);
    }
}

async function loadMining() {
    try {
        const mining = await request('/admin/mining');
        const tbody = document.getElementById('miningBody');
        tbody.innerHTML = mining.map(m => `
            <tr>
                <td>${m.machineName}</td>
                <td>${m.price} USDT</td>
                <td>${m.periodIncome} USDT</td>
                <td>${m.period} days</td>
                <td>${new Date(m.startDate).toLocaleDateString()}</td>
            </tr>
        `).join('');
    } catch (err) {
        setStatus(`Failed to load mining: ${err.message}`, true);
    }
}

async function updateBalance() {
    const userId = document.getElementById('userIdInput').value;
    const balance = Number(document.getElementById('balanceInput').value);
    
    if (!userId || Number.isNaN(balance) || balance < 0) {
        setStatus('Please enter a valid user ID and non-negative balance.', true);
        return;
    }
    
    try {
        await request('/admin/update-balance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, balance })
        });
        setStatus(`Balance updated for ${userId}.`);
        document.getElementById('userIdInput').value = '';
        document.getElementById('balanceInput').value = '';
        loadUsers();
        loadDashboard();
    } catch (err) {
        setStatus(`Failed to update balance: ${err.message}`, true);
    }
}

async function deleteUser(id) {
    if (!confirm('Delete this user?')) return;
    try {
        await request(`/admin/users/${id}`, { method: 'DELETE' });
        setStatus('User deleted.');
        loadDashboard();
        loadUsers();
    } catch (err) {
        setStatus(`Failed to delete user: ${err.message}`, true);
    }
}

async function deleteTransaction(id) {
    if (!confirm('Delete this transaction?')) return;
    try {
        await request(`/admin/transactions/${id}`, { method: 'DELETE' });
        setStatus('Transaction deleted.');
        loadDashboard();
        loadTransactions();
    } catch (err) {
        setStatus(`Failed to delete transaction: ${err.message}`, true);
    }
}

function editUser(userId) {
    const newBalance = prompt(`Enter new balance for ${userId}:`);
    if (newBalance === null) return;
    const parsed = Number(newBalance);
    if (Number.isNaN(parsed) || parsed < 0) {
        setStatus('Invalid balance amount.', true);
        return;
    }
    document.getElementById('userIdInput').value = userId;
    document.getElementById('balanceInput').value = parsed;
    updateBalance();
}

// Load dashboard on page load
if (document.getElementById('dashboard')) {
    loadDashboard();
}
