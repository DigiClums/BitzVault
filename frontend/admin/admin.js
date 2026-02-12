const API_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3001/api'
  : 'https://bitzvault.onrender.com/api';

const usersState = {
  query: '',
  page: 1,
  limit: 10,
  totalPages: 1
};

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

function handleUnauthorized() {
  localStorage.removeItem('adminToken');
  window.location.href = 'login.html';
}

async function api(path, options = {}) {
  const token = localStorage.getItem('adminToken');
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });

  if (res.status === 401 || res.status === 403) {
    handleUnauthorized();
    throw new Error('Session expired. Please login again.');
  }

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
  if (id === 'users') loadUsers(usersState.page);
  if (id === 'transactions') loadTransactions();
  if (id === 'mining') loadMining();
}

function openSettingsWithUser(userId) {
  clearStatus();
  document.querySelectorAll('.panel').forEach((panel) => panel.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach((link) => link.classList.remove('active'));

  document.getElementById('settings').classList.add('active');
  const settingsLink = document.querySelector('.nav-link[onclick*="settings"]');
  if (settingsLink) settingsLink.classList.add('active');

  document.getElementById('userIdInput').value = userId;
  document.getElementById('amountInput').focus();
}

function formatAmount(value) {
  const n = Number(value || 0);
  return `${n.toFixed(2)} USDT`;
}

function updateUsersPaginationInfo() {
  const info = document.getElementById('usersPaginationInfo');
  if (!info) return;
  info.textContent = `Page ${usersState.page} / ${usersState.totalPages}`;
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

function applyUsersSearch() {
  usersState.query = (document.getElementById('usersSearchInput').value || '').trim();
  usersState.page = 1;
  loadUsers(1);
}

function resetUsersSearch() {
  document.getElementById('usersSearchInput').value = '';
  usersState.query = '';
  usersState.page = 1;
  loadUsers(1);
}

function prevUsersPage() {
  if (usersState.page <= 1) return;
  loadUsers(usersState.page - 1);
}

function nextUsersPage() {
  if (usersState.page >= usersState.totalPages) return;
  loadUsers(usersState.page + 1);
}

async function loadUsers(page = 1) {
  try {
    const queryParams = new URLSearchParams({
      page: String(page),
      limit: String(usersState.limit)
    });

    if (usersState.query) {
      queryParams.set('q', usersState.query);
    }

    const result = await api(`/admin/users?${queryParams.toString()}`);
    const users = result.items || [];
    const pagination = result.pagination || { page: 1, totalPages: 1 };

    usersState.page = pagination.page || 1;
    usersState.totalPages = pagination.totalPages || 1;
    updateUsersPaginationInfo();

    const tbody = document.getElementById('usersBody');
    tbody.innerHTML = users.map((u) => `
      <tr>
        <td>${u.userId}</td>
        <td>${u.phone}</td>
        <td>${formatAmount(u.balance)}</td>
        <td>${u.inviteCode || '-'}</td>
        <td>
          <button class="btn small" onclick="openSettingsWithUser('${u.userId}')">Adjust</button>
          <button class="btn small danger" onclick="deleteUser('${u.id}')">Delete</button>
        </td>
      </tr>
    `).join('');

    if (!users.length) {
      tbody.innerHTML = '<tr><td colspan="5">No users found.</td></tr>';
    }
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
        <td>${t.note || '-'}</td>
        <td>
          <button class="btn small danger" onclick="deleteTransaction('${t.id}')">Delete</button>
        </td>
      </tr>
    `).join('');

    if (!transactions.length) {
      tbody.innerHTML = '<tr><td colspan="6">No transactions found.</td></tr>';
    }
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

    if (!machines.length) {
      tbody.innerHTML = '<tr><td colspan="5">No mining records found.</td></tr>';
    }
  } catch (error) {
    showStatus(`Mining load failed: ${error.message}`, true);
  }
}

async function adjustBalance() {
  const userId = document.getElementById('userIdInput').value.trim();
  const operation = document.getElementById('operationInput').value;
  const amount = Number(document.getElementById('amountInput').value);
  const reason = document.getElementById('reasonInput').value.trim();

  if (!userId) {
    showStatus('User ID is required.', true);
    return;
  }
  if (!['credit', 'debit'].includes(operation)) {
    showStatus('Select a valid operation.', true);
    return;
  }
  if (Number.isNaN(amount) || amount <= 0) {
    showStatus('Amount must be greater than zero.', true);
    return;
  }
  if (reason.length < 3) {
    showStatus('Reason is required (min 3 characters).', true);
    return;
  }

  try {
    const result = await api('/admin/balance-adjust', {
      method: 'POST',
      body: JSON.stringify({ userId, operation, amount, reason })
    });

    document.getElementById('amountInput').value = '';
    document.getElementById('reasonInput').value = '';

    showStatus(
      `Balance ${result.operation} applied. ${result.userId}: ${formatAmount(result.oldBalance)} -> ${formatAmount(result.newBalance)}`
    );

    loadUsers(usersState.page);
    loadDashboard();
    loadTransactions();
  } catch (error) {
    showStatus(`Balance operation failed: ${error.message}`, true);
  }
}

async function deleteUser(id) {
  if (!window.confirm('Delete this user?')) return;

  try {
    await api(`/admin/users/${id}`, { method: 'DELETE' });
    showStatus('User deleted.');
    loadUsers(usersState.page);
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
