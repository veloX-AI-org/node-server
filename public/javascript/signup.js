const emailSubmitBtn = document.getElementById('SendOTPBtnId');
const emailField = document.getElementById('SignUpEmailID');
const emailSubmitBtnMainContent = document.getElementById('submitEmailBtnContentId');
const loadingAnimation = document.getElementById('loadingAnimation');
const dynamiContainer = document.querySelector('.dynamic-container');
const firstProgressBar = document.querySelector('.progress-bar-first-step');

const verificationContent = `
<div class="verifyOTPform">
    <div class="otp-label">Verification Code</div>

    <div class="otps-input-fields">
        <input type="text" oninput="activeInput(0)" name="otp0" id="otp0" required>
        <input type="text" oninput="activeInput(1)" name="otp1" id="otp1" required>
        <input type="text" oninput="activeInput(2)" name="otp2" id="otp2" required>
        <input type="text" oninput="activeInput(3)" name="otp3" id="otp3" required>
        <input type="text" oninput="activeInput(4)" name="otp4" id="otp4" required>
    </div>

    <button type="submit" id="VerifyOTPBtnId">
        <div style="display: none;" id="verifyBtnloadingAnimation" class="dots">
            <span></span>
            <span></span>
            <span></span>
        </div>
        <span id="VerifyOTPBtnContentId">Verify</span>
    </button> 
</div>`

const profileContent = `
<div class="first-name-and-last-name-container">
    <div class="first-name-container">
        <p>First Name *</p>
        <input type="text" name="firstName" id="firstNameId" placeholder="John" required>
    </div>
    <div class="last-name-container">
        <p>Last Name *</p>
        <input type="text" name="lastName" id="lastNameId" placeholder="Doe" required>
    </div>
</div>
<div class="signup-password-container">
    <p>Password *</p>
    <input type="password" name="signupPassowrd" id="signupPassowrdId" placeholder="Enter password">
</div>
<button type="submit" id="createAccountBtnId">
    <div style="display: none;" id="createAccountloadingAnimation" class="dots">
        <span></span>
        <span></span>
        <span></span>
    </div>
    <span id="createAccountBtnContentId">Create Account</span>
</button>
`;

const activeInput = (inputIndex) => {
    let currentInput = document.getElementById(`otp${inputIndex}`);

    if (inputIndex == 4 && currentInput.value.length >= 1) {
        currentInput.value = currentInput.value[0];
        return;
    }

    let nextInput = document.getElementById(`otp${inputIndex+1}`);

    if (currentInput.value.length >= 1) {
        currentInput.value = currentInput.value[0];
        nextInput.focus();
        return;
    }
};

const updateFirstTopStatus = () => {
    document.querySelector('.progress-bar-first-step').style.width = '100%';
    document.getElementById('firstStepFirstCirle').style.border = '0px';
    document.getElementById('firstStepFirstCirle').style.background = '#2a2a2a';
    document.getElementById('firstStepFirstCirle').innerHTML = `<span class="material-symbols-outlined">check</span>`
    document.getElementById('status-in-text-first-step').innerText = 'Completed';
    document.getElementById('status-in-text-first-step').style.background = '#C6FFC2';
    document.getElementById('status-in-text-first-step').style.color = '#00AD14';
    document.getElementById('second-step-email').style.fontWeight = '600';
    document.getElementById('second-step-email').style.color = '#000';

    document.getElementById('status-in-text-second-step').innerText = 'In Progress';
    document.getElementById('status-in-text-second-step').style.background = '#B8B7FF';
    document.getElementById('status-in-text-second-step').style.color = '#6764FF';
    document.getElementById('status-in-text-second-step').style.width = '62px';
    
    document.getElementById('secondStepsecondCirle').style.border = '3px solid #2a2a2a';
    document.getElementById('secondStepsecondCirle').style.background = '#fff';
    document.getElementById('secondStepInsideCircle').style.display = 'flex';
};

const updateSecondTopStatus = () => {
    document.querySelector('.progress-bar-second-step').style.width = '100%';
    document.getElementById('secondStepsecondCirle').style.border = '0px';
    document.getElementById('secondStepsecondCirle').style.background = '#2a2a2a';
    document.getElementById('secondStepsecondCirle').innerHTML = `<span class="material-symbols-outlined">check</span>`
    document.getElementById('status-in-text-second-step').innerText = 'Completed';
    document.getElementById('status-in-text-second-step').style.background = '#C6FFC2';
    document.getElementById('status-in-text-second-step').style.color = '#00AD14';
    document.getElementById('third-step-email').style.fontWeight = '600';
    document.getElementById('third-step-email').style.color = '#000';

    document.getElementById('status-in-text-third-step').innerText = 'In Progress';
    document.getElementById('status-in-text-third-step').style.background = '#B8B7FF';
    document.getElementById('status-in-text-third-step').style.color = '#6764FF';
    document.getElementById('status-in-text-third-step').style.width = '62px';
        
    document.getElementById('thirdStepthirdCirle').style.border = '3px solid #2a2a2a';
    document.getElementById('thirdStepthirdCirle').style.background = '#fff';
    document.getElementById('thirdStepInsideCircle').style.display = 'flex';
};

//---------------------------------------
// Send Email, Get OTP, Verify & Create User Logic
//---------------------------------------
emailSubmitBtn.addEventListener("click", async() => {
    const email = emailField.value;
    
    // Validate Email
    if (!email) {
        alert("Email Require");
        return;
    } 

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address");
        return;
    }

    // Start Animation
    emailSubmitBtnMainContent.style.display = 'none';
    loadingAnimation.style.display = 'flex';

    // Send Email to Server
    // const otpSendResponse = await fetch(
    //     '/send-otp',
    //     {
    //         method: "POST",
    //         headers: {
    //             'content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //             email: email
    //         })
    //     }
    // )

    // let data = await otpSendResponse.json();

    // // Show status to client
    // if (data.success) {
    //     alert("OTP sent to your email.")
    // } else {
    //     // Stop Animation
    //     emailSubmitBtnMainContent.style.display = 'block';
    //     loadingAnimation.style.display = 'none';
    //     alert(data.message);
    //     return;
    // }

    // Stop Animation
    emailSubmitBtnMainContent.style.display = 'block';
    loadingAnimation.style.display = 'none';

    //Update top status
    updateFirstTopStatus();

    // Remove email field from dynamic container
    dynamiContainer.innerHTML = verificationContent;

    //-------------
    // Verify Email Logic
    //-------------
    const verifyBtn = document.getElementById('VerifyOTPBtnId');
    const verifyBtnContentId = document.getElementById('VerifyOTPBtnContentId');
    const verifyBtnloadingAnimation = document.getElementById('verifyBtnloadingAnimation');

    verifyBtn.addEventListener("click", async() => {
        // Get OTP from client
        let UserOTP = '';

        // Validate OTP
        for (let i=0; i<5; i++){
            UserOTP += document.getElementById(`otp${i}`).value;
        }

        if (!UserOTP || UserOTP.length < 5) {
            alert("Invalid OTP");
            return;
        }

        // Start Animation
        verifyBtnContentId.style.display = 'none';
        verifyBtnloadingAnimation.style.display = 'flex';

        // Post that OTP to server
        // const verifyOTPRes = await fetch(
        //     '/send-otp/verify',
        //     {
        //         method: 'POST',
        //         headers: {
        //             'content-Type': 'application/json'
        //         },
        //         body: JSON.stringify({
        //             email: email,
        //             otp: UserOTP
        //         })
        //     }
        // )

        // let data = await verifyOTPRes.json();

        // // Inform User
        // if (data.success) {
        //     alert(data.message);
        // } else {
        //     // Stop Animation
        //     verifyBtnContentId.style.display = 'flex';
        //     verifyBtnloadingAnimation.style.display = 'none';
        //     alert(data.message);
        //     return;
        // }

        // Stop Animation
        verifyBtnContentId.style.display = 'flex';
        verifyBtnloadingAnimation.style.display = 'none';

        // Update Top Status
        updateSecondTopStatus();
        
        // Remove verification field from dynamic container
        dynamiContainer.innerHTML = profileContent;

        // --------
        // Create Profile Logic
        // --------
        const createAccountBtnId = document.getElementById('createAccountBtnId');
        const createAccountloadingAnimation = document.getElementById('createAccountloadingAnimation');
        const createAccountBtnContentId = document.getElementById('createAccountBtnContentId');

        const firstNameId = document.getElementById('firstNameId');
        const lastNameId = document.getElementById('lastNameId');
        const signupPassowrdId = document.getElementById('signupPassowrdId');

        createAccountBtnId.addEventListener("click", async() => {
            // Fetch form data
            const firstname = firstNameId.value;
            const lastname = lastNameId.value;
            const password = signupPassowrdId.value;

            // Validate Input Fields
            if (!firstname || !lastname || !password) {
                alert("All fields are required");
                return;
            }

            // Start Animation
            createAccountBtnContentId.style.display = 'none';
            createAccountloadingAnimation.style.display = 'flex';

            // Send data to the server
            const createdUserResponse = await fetch(
                '/signup',
                {
                    method: 'POST',
                    headers: {
                        'content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        firstname: firstname,
                        lastname: lastname,
                        email: email,
                        password: password,
                        provider: "local"
                    })
                }
            )

            let data = await createdUserResponse.json();
            
            if (data.success) {
                // Stop Animation
                createAccountBtnContentId.style.display = 'flex';
                createAccountloadingAnimation.style.display = 'none';
                
                // Redirect user to it's notebook
                window.location.href = '/listnotebooks';
            } else {
                alert(data.message);
            }

        });
    });
});