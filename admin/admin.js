const API_URL = 'http://localhost:3001/api';

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.sidebar nav a').forEach(a => a.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    event.target.classList.add('active');
    
    if (sectionId === 'dashboard') loadDashboard();
    if (sectionId === 'users') loadUsers();
    if (sectionId === 'transactions') loadTransactions();
    if (sectionId === 'mining') loadMining();
}

async function loadDashboard() {
    try {
        const stats = await fetch(`${API_URL}/admin/stats`).then(r => r.json());
        document.getElementById('totalUsers').textContent = stats.totalUsers;
        document.getElementById('totalBalance').textContent = stats.totalBalance.toFixed(2) + ' USDT';
        document.getElementById('totalTransactions').textContent = stats.totalTransactions;
        document.getElementById('totalMining').textContent = stats.totalMining;
    } catch (err) {
        console.error('Failed to load dashboard:', err);
    }
}

async function loadUsers() {
    try {
        const users = await fetch(`${API_URL}/admin/users`).then(r => r.json());
        const tbody = document.getElementById('usersBody');
        tbody.innerHTML = users.map(u => `
            <tr>
                <td>${u.userId}</td>
                <td>${u.phone}</td>
                <td>${u.balance.toFixed(2)} USDT</td>
                <td>${u.inviteCode}</td>
                <td>
                    <button class="action-btn edit-btn" onclick="editUser('${u.userId}')">Edit</button>
                    <button class="action-btn delete-btn" onclick="deleteUser(${u.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        console.error('Failed to load users:', err);
    }
}

async function loadTransactions() {
    try {
        const transactions = await fetch(`${API_URL}/admin/transactions`).then(r => r.json());
        const tbody = document.getElementById('transactionsBody');
        tbody.innerHTML = transactions.map(t => `
            <tr>
                <td>${t.type.toUpperCase()}</td>
                <td>${t.amount} USDT</td>
                <td>${t.status}</td>
                <td>${new Date(t.createdAt).toLocaleString()}</td>
                <td>
                    <button class="action-btn delete-btn" onclick="deleteTransaction(${t.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        console.error('Failed to load transactions:', err);
    }
}

async function loadMining() {
    try {
        const mining = await fetch(`${API_URL}/admin/mining`).then(r => r.json());
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
        console.error('Failed to load mining:', err);
    }
}

async function updateBalance() {
    const userId = document.getElementById('userIdInput').value;
    const balance = document.getElementById('balanceInput').value;
    
    if (!userId || !balance) {
        alert('Please fill all fields');
        return;
    }
    
    try {
        await fetch(`${API_URL}/admin/update-balance`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, balance: parseFloat(balance) })
        });
        alert('Balance updated successfully');
        document.getElementById('userIdInput').value = '';
        document.getElementById('balanceInput').value = '';
    } catch (err) {
        alert('Failed to update balance');
    }
}

async function deleteUser(id) {
    if (!confirm('Delete this user?')) return;
    try {
        await fetch(`${API_URL}/admin/users/${id}`, { method: 'DELETE' });
        loadUsers();
    } catch (err) {
        alert('Failed to delete user');
    }
}

async function deleteTransaction(id) {
    if (!confirm('Delete this transaction?')) return;
    try {
        await fetch(`${API_URL}/admin/transactions/${id}`, { method: 'DELETE' });
        loadTransactions();
    } catch (err) {
        alert('Failed to delete transaction');
    }
}

function editUser(userId) {
    const newBalance = prompt('Enter new balance:');
    if (newBalance) {
        updateBalance();
    }
}

// Load dashboard on page load
if (document.getElementById('dashboard')) {
    loadDashboard();
}
