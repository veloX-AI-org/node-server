const passwordField = document.getElementById('password');
const show = document.getElementById('show');
const hide = document.getElementById('hide');

hide.style.display = "none";  

show.onclick = () => {
    passwordField.type = "text";
    show.style.display = "none";
    hide.style.display = "inline";
};

hide.onclick = () => {
    passwordField.type = "password";
    hide.style.display = "none";
    show.style.display = "inline";
};

const signinwithGoogleBtn = document.querySelector('.signin-with-google-container');

signinwithGoogleBtn.addEventListener("click", () => {
    signinwithGoogleBtn.innerHTML = `
    <div class="dots">
        <span></span>
        <span></span>
        <span></span>
    </div>
    `;

    setTimeout(() => {
        signinwithGoogleBtn.innerHTML = `
        <img class="google-logo-png" src="images/google-logo.png" alt="Google Logo">
        <p>Continue with Google</p>
        `

        window.location.href = '/auth/google';
    }, 2000);
});