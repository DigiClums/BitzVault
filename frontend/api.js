const API_URL = 'http://localhost:3001/api';

const api = {
  async register(phone, password, inviteCode) {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password, inviteCode })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  async login(phone, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  async getProfile() {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/users/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  async getBalance() {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/users/balance`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  async deposit(amount, address) {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/transactions/deposit`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, address })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  async withdraw(amount, address) {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/transactions/withdraw`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, address })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  async getTransactions() {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/transactions`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  async purchaseMining(machineName, price, periodIncome, period) {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/mining/purchase`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ machineName, price, periodIncome, period })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  async getMining() {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/mining`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  async purchaseInvestment(planName, amount, yieldRate, earningsType, duration) {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/investments/purchase`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ planName, amount, yieldRate, earningsType, duration })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  async getInvestments() {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/investments`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  }
};
