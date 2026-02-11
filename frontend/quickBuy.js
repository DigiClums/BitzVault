const purchaseInput = document.getElementById('purchaseAmount');
const estimatedUSDT = document.getElementById('estimatedUSDT');
const USDT_RATE = 90;

purchaseInput?.addEventListener('input', (e) => {
    const amount = parseFloat(e.target.value) || 0;
    const usdt = (amount / USDT_RATE).toFixed(2);
    estimatedUSDT.textContent = usdt;
});

function selectPayment() {
    Toast.info('Payment method selection coming soon');
}

function confirmPurchase() {
    const amount = purchaseInput.value;
    const name = document.getElementById('transferorName').value;
    const btn = event.target;
    
    if (!amount || amount < 10000) {
        Toast.error('Minimum amount is ₹10,000');
        return;
    }
    
    if (!name) {
        Toast.error('Please enter transferor name');
        return;
    }
    
    setButtonLoading(btn, true);
    
    setTimeout(() => {
        Toast.success('Purchase confirmed!');
        setButtonLoading(btn, false);
    }, 1500);
}
