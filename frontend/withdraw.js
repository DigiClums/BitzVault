async function submitWithdraw() {
    const wallet = document.getElementById('walletAddress').value;
    const amount = document.getElementById('withdrawAmount').value;
    const btn = event.target;
    
    if (!wallet) {
        Toast.error('Please enter wallet address');
        return;
    }
    
    if (!amount || amount < 138) {
        Toast.error('Minimum withdrawal amount is 138 USDT');
        return;
    }
    
    setButtonLoading(btn, true);
    
    try {
        await api.withdraw(amount, wallet);
        Toast.success('Withdrawal order submitted successfully!');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    } catch (err) {
        Toast.error(err.message || 'Withdrawal failed');
        setButtonLoading(btn, false);
    }
}
