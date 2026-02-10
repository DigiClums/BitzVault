function copyAddress() {
    const address = document.getElementById('depositAddress').textContent;
    navigator.clipboard.writeText(address);
    alert('Address copied!');
}

async function confirmDeposit() {
    const amount = document.getElementById('depositAmount').value;
    const address = document.getElementById('depositAddress').textContent;
    
    if (!amount || amount < 100) {
        alert('Minimum deposit is 100 USDT');
        return;
    }
    
    try {
        await api.deposit(amount, address);
        alert('Deposit confirmed! Balance updated.');
        window.location.href = 'index.html';
    } catch (err) {
        alert(err.message || 'Deposit failed');
    }
}
