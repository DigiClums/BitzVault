// Initialize user data
const userId = document.getElementById('userId');
const usdtBalance = document.getElementById('usdtBalance');
if (userId) userId.textContent = Math.floor(Math.random() * 1000000);
if (usdtBalance) usdtBalance.textContent = '1,234.56';

// Simulate BTC price updates
function updateBTCPrice() {
    const btcPrice = document.getElementById('btcPrice');
    const btcChange = document.getElementById('btcChange');
    if (!btcPrice || !btcChange) return;
    
    const basePrice = 43250;
    const variation = Math.random() * 1000 - 500;
    const price = (basePrice + variation).toFixed(2);
    const change = (Math.random() * 10 - 5).toFixed(2);
    
    btcPrice.textContent = `$${price}`;
    btcChange.textContent = `${change >= 0 ? '+' : ''}${change}%`;
    btcChange.className = change >= 0 ? 'crypto-change' : 'crypto-change negative';
}

if (document.getElementById('btcPrice')) {
    updateBTCPrice();
    setInterval(updateBTCPrice, 5000);
}

// Action handlers
function quickBuy() {
    window.location.href = 'quickBuy.html';
}

function otcTrading() {
    alert('OTC Trading - Feature coming soon!');
}

function navigate(section) {
    if (section === 'team') {
        window.location.href = 'team.html';
    } else if (section === 'vip') {
        window.location.href = 'vip.html';
    } else if (section === 'invite') {
        window.location.href = 'invite.html';
    } else if (section === 'commission') {
        window.location.href = 'commission.html';
    } else {
        alert(`${section.charAt(0).toUpperCase() + section.slice(1)} - Feature coming soon!`);
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    window.location.href = 'login.html';
}
