function copyCode() {
    const code = document.getElementById('inviteCode').textContent;
    navigator.clipboard.writeText(code);
    alert('Invitation code copied!');
}

function copyLink() {
    const link = document.getElementById('inviteLink').textContent;
    navigator.clipboard.writeText(link);
    alert('Invitation link copied!');
}
