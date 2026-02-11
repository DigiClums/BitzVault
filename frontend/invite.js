function copyCode() {
    const code = document.getElementById('inviteCode').textContent;
    copyToClipboard(code, 'Invitation code copied!');
}

function copyLink() {
    const link = document.getElementById('inviteLink').textContent;
    copyToClipboard(link, 'Invitation link copied!');
}
