const API_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3001/api'
  : 'https://bitzvault.onrender.com/api';

function showStatus(message, isError = false) {
  const el = document.getElementById('status');
  if (!el) return;
  el.textContent = message;
  el.className = `status ${isError ? 'error' : 'success'}`;
  el.style.display = 'block';
}

function clearStatus() {
  const el = document.getElementById('status');
  if (!el) return;
  el.style.display = 'none';
}

async function api(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

function showSection(event, id) {
  event.preventDefault();
  clearStatus();

  document.querySelectorAll('.panel').forEach((panel) => panel.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach((link) => link.classList.remove('active'));

  document.getElementById(id).classList.add('active');
  if (event.currentTarget) {
    event.currentTarget.classList.add('active');
  }

  if (id === 'dashboard') loadDashboard();
  if (id === 'users') loadUsers();
  if (id === 'transactions') loadTransactions();
  if (id === 'mining') loadMining();
}

function formatAmount(value) {
  const n = Number(value || 0);
  return `${n.toFixed(2)} USDT`;
}

async function loadDashboard() {
  try {
    const stats = await api('/admin/stats');
    document.getElementById('totalUsers').textContent = stats.totalUsers || 0;
    document.getElementById('totalBalance').textContent = formatAmount(stats.totalBalance);
    document.getElementById('totalTransactions').textContent = stats.totalTransactions || 0;
    document.getElementById('totalMining').textContent = stats.totalMining || 0;
  } catch (error) {
    showStatus(`Dashboard load failed: ${error.message}`, true);
  }
}

async function loadUsers() {
  try {
    const users = await api('/admin/users');
    const tbody = document.getElementById('usersBody');
    tbody.innerHTML = users.map((u) => `
      <tr>
        <td>${u.userId}</td>
        <td>${u.phone}</td>
        <td>${formatAmount(u.balance)}</td>
        <td>${u.inviteCode || '-'}</td>
        <td>
          <button class="btn small" onclick="editUser('${u.userId}')">Edit</button>
          <button class="btn small danger" onclick="deleteUser('${u.id}')">Delete</button>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    showStatus(`Users load failed: ${error.message}`, true);
  }
}

async function loadTransactions() {
  try {
    const transactions = await api('/admin/transactions');
    const tbody = document.getElementById('transactionsBody');
    tbody.innerHTML = transactions.map((t) => `
      <tr>
        <td>${(t.type || '-').toUpperCase()}</td>
        <td>${formatAmount(t.amount)}</td>
        <td>${t.status || '-'}</td>
        <td>${t.createdAt ? new Date(t.createdAt).toLocaleString() : '-'}</td>
        <td>
          <button class="btn small danger" onclick="deleteTransaction('${t.id}')">Delete</button>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    showStatus(`Transactions load failed: ${error.message}`, true);
  }
}

async function loadMining() {
  try {
    const machines = await api('/admin/mining');
    const tbody = document.getElementById('miningBody');
    tbody.innerHTML = machines.map((m) => `
      <tr>
        <td>${m.machineName || '-'}</td>
        <td>${formatAmount(m.price)}</td>
        <td>${formatAmount(m.periodIncome)}</td>
        <td>${m.period || 0} days</td>
        <td>${m.startDate ? new Date(m.startDate).toLocaleDateString() : '-'}</td>
      </tr>
    `).join('');
  } catch (error) {
    showStatus(`Mining load failed: ${error.message}`, true);
  }
}

async function updateBalance() {
  const userId = document.getElementById('userIdInput').value.trim();
  const balance = Number(document.getElementById('balanceInput').value);

  if (!userId || Number.isNaN(balance) || balance < 0) {
    showStatus('Please enter valid user ID and non-negative balance.', true);
    return;
  }

  try {
    await api('/admin/update-balance', {
      method: 'POST',
      body: JSON.stringify({ userId, balance })
    });

    document.getElementById('userIdInput').value = '';
    document.getElementById('balanceInput').value = '';

    showStatus(`Balance updated for ${userId}.`);
    loadUsers();
    loadDashboard();
  } catch (error) {
    showStatus(`Balance update failed: ${error.message}`, true);
  }
}

function editUser(userId) {
  document.getElementById('userIdInput').value = userId;
  document.getElementById('balanceInput').focus();
  clearStatus();
  document.querySelectorAll('.panel').forEach((panel) => panel.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach((link) => link.classList.remove('active'));
  document.getElementById('settings').classList.add('active');
  const settingsLink = document.querySelector('.nav-link[onclick*=\"settings\"]');
  if (settingsLink) {
    settingsLink.classList.add('active');
  }
}

async function deleteUser(id) {
  if (!window.confirm('Delete this user?')) return;

  try {
    await api(`/admin/users/${id}`, { method: 'DELETE' });
    showStatus('User deleted.');
    loadUsers();
    loadDashboard();
  } catch (error) {
    showStatus(`Delete failed: ${error.message}`, true);
  }
}

async function deleteTransaction(id) {
  if (!window.confirm('Delete this transaction?')) return;

  try {
    await api(`/admin/transactions/${id}`, { method: 'DELETE' });
    showStatus('Transaction deleted.');
    loadTransactions();
    loadDashboard();
  } catch (error) {
    showStatus(`Delete failed: ${error.message}`, true);
  }
}

if (document.getElementById('dashboard')) {
  loadDashboard();
}
