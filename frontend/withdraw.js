async function submitWithdraw() {
    const wallet = document.getElementById('walletAddress').value;
    const amount = document.getElementById('withdrawAmount').value;
    
    if (!wallet) {
        alert('Please enter wallet address');
        return;
    }
    
    if (!amount || amount < 138) {
        alert('Minimum withdrawal amount is 138 USDT');
        return;
    }
    
    try {
        await api.withdraw(amount, wallet);
        alert('Withdrawal order submitted successfully!');
        window.location.href = 'index.html';
    } catch (err) {
        alert(err.message || 'Withdrawal failed');
    }
}
