const signInWithGoogleId = document.getElementById("signInWithGoogleId");
const signInWithGoogleMainContent = document.getElementById('continue-with-google-container-container');
const signInWithGoogleLoadingAnimation = document.getElementById('signInWithGoogleLoadingAnimation');

signInWithGoogleId.addEventListener("click", () => {
    signInWithGoogleId.disabled = true;
    
    signInWithGoogleMainContent.style.display = 'none';
    signInWithGoogleLoadingAnimation.style.display = 'flex';
    
    setTimeout(() => {
        window.location.href = '/auth/google';
    }, 2000);
});
