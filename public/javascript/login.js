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