// Logout Logic
const logoutBtn = document.getElementById('logoutBtn');

logoutBtn.addEventListener("click", () => {
    logoutBtn.innerHTML = `
    <div class="dots">
        <span style="width: 5px; height: 5px; background: white;"></span>
        <span style="width: 5px; height: 5px; background: white;"></span>
        <span style="width: 5px; height: 5px; background: white;"></span>
    </div>
    `;
    
    setTimeout(() => {
        window.location.href = '/logout';
    }, 2000);
});