const purchaseInput = document.getElementById('purchaseAmount');
const estimatedUSDT = document.getElementById('estimatedUSDT');
const USDT_RATE = 90;

purchaseInput?.addEventListener('input', (e) => {
    const amount = parseFloat(e.target.value) || 0;
    const usdt = (amount / USDT_RATE).toFixed(2);
    estimatedUSDT.textContent = usdt;
});

function selectPayment() {
    alert('Payment method selection');
}

function confirmPurchase() {
    const amount = purchaseInput.value;
    const name = document.getElementById('transferorName').value;
    
    if (!amount || amount < 10000) {
        alert('Minimum amount is ₹10,000');
        return;
    }
    
    if (!name) {
        alert('Please enter transferor name');
        return;
    }
    
    alert('Purchase confirmed!');
}
