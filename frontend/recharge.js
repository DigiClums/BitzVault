function copyAddress() {
    const address = document.getElementById('depositAddress').textContent;
    copyToClipboard(address, 'Deposit address copied!');
}

async function confirmDeposit() {
    const amount = document.getElementById('depositAmount').value;
    const address = document.getElementById('depositAddress').textContent;
    const btn = event.target;
    
    if (!amount || amount < 100) {
        Toast.error('Minimum deposit is 100 USDT');
        return;
    }
    
    setButtonLoading(btn, true);
    
    try {
        await api.deposit(amount, address);
        Toast.success('Deposit confirmed! Balance updated.');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    } catch (err) {
        Toast.error(err.message || 'Deposit failed');
        setButtonLoading(btn, false);
    }
}
