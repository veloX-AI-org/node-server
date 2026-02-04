const uploadYoutubeURLBtn = document.getElementById('uploadYoutubeURL');
const quizContainer = document.querySelector('.quiz-container');
const nextQuizBtn = document.getElementById('nextQuizBtn');

nextQuizBtn.disabled = true;

uploadYoutubeURLBtn.addEventListener("click", async() => {
    const youtubeURLLink = document.getElementById('youtubeURLLink').value;

    const start = Date.now();

    uploadYoutubeURLBtn.innerHTML = `
    <div class="dots">
        <span style="width: 5px; height: 5px; background: white;"></span>
        <span style="width: 5px; height: 5px; background: white;"></span>
        <span style="width: 5px; height: 5px; background: white;"></span>
    </div>
    `; 

    const quizResponse = await fetch(
        '/generateQuiz',
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ youtubeURLLink })
        }
    );

    uploadYoutubeURLBtn.innerHTML = `Upload`;

    const response = await quizResponse.json();
    
    const quizzes = response.data.message;
    nextQuizBtn.style.display = 'flex';
    
    let quizIndex = 0;
    let score = 0;  
    let isAnswered = false;

    window.check = (answer) => {
        if (isAnswered) return;

        isAnswered = true;
        nextQuizBtn.disabled = false;

        let currentQuiz = quizzes[quizIndex];

        if (answer == currentQuiz.answer) {
            score += 100;
            document.querySelector(`.option-${answer}`).style.border = '2px solid #2a2a2a';
            document.querySelector(`.option-${answer}`).innerHTML = `
            <span style="text-align: left; width: 85%;">${currentQuiz.options[answer]}</span>
            <div class="circle"><span class="material-symbols-outlined">check</span></div>
            `;

            document.querySelector(`.explanation-${answer}`).style.padding = '5px 15px';
            document.querySelector(`.explanation-${answer}`).style.display = 'flex';
        } else {
            document.querySelector(`.option-${answer}`).innerHTML = `
            <span style="text-align: left; width: 85%;">${currentQuiz.options[answer]}</span>
            <div class="circle"><span class="material-symbols-outlined">close</span></div>
            `;

            document.querySelector(`.option-${currentQuiz.answer}`).style.border = '2px solid #2a2a2a';
            document.querySelector(`.option-${currentQuiz.answer}`).innerHTML = `
            <span style="text-align: left; width: 85%;">${currentQuiz.options[currentQuiz.answer]}</span>
            <div class="circle"><span class="material-symbols-outlined">check</span></div>
            `;

            document.querySelector(`.explanation-${currentQuiz.answer}`).style.padding = '5px 15px';
            document.querySelector(`.explanation-${currentQuiz.answer}`).style.display = 'flex';
        }
    };
    
    if (response.data.success) {
        console.log("Success Called");
        window.startQuiz = () => {
            nextQuizBtn.style.display = 'flex';

            let quiz = quizzes[quizIndex];
            
            let currentQuizHTML = `<p style="font-size: 15px; text-align: center;font-weight: 500;">${quiz.question}</p>`
            currentQuizHTML += quiz.options.map((options, index) => {
                return `
                <button class="options option-${index}" onclick="check(${index})"><span style="text-align: left;">${options}</span></button>
                <div class="explanations explanation-${index}">
                    <div class="explanation-vertical-line"></div>
                    <p>
                        <font style="font-weight: 600;">Explanation :</font>
                        ${quiz.explanation}
                    </p>
                </div>
                `
            }).join("");

            quizContainer.innerHTML = currentQuizHTML;
        };

        window.nextQuiz = () => {
            if (!isAnswered) return;

            quizIndex++;

            const progressBar = document.getElementById('progress-bar');

            increaseWidth(progressBar);

            if (quizIndex < quizzes.length) {
                startQuiz();
                nextQuizBtn.disabled = true;
                isAnswered = false;
            } else {
                const end = Date.now();
                const elapsed = end - start;

                function formatFromMs(ms) {
                const totalSeconds = Math.floor(ms / 1000);
                const minutes = Math.floor(totalSeconds / 60);
                const seconds = totalSeconds % 60;

                return `${minutes}m ${seconds}s`;
                }

                quizContainer.innerHTML = `
                <div class="score-main-container">
                    <div class="score-main-top-container">
                    <div class="score-main-top-left-container">
                        <button onclick="startQuiz();">Take Again</button>

                        <div style="margin: auto;" class="progress-circle">
                            <span class="progress-text">0%</span>
                        </div>

                        <div style="font-size: 14px; font-weight: 500;" class="score-main-top-left-bottom-container">
                            <p style="color: #A5A5A5;">Quiz Completed!</p>
                            <p style="color: #525252;">
                                Time Taken • ${formatFromMs(elapsed)}
                            </p>
                        </div>
                    </div>
                    </div>

                    <div class="score-main-bottom-container">
                        <div class="score-main-bottom-left-container">
                            <p>${score}</p>
                            <p style="color: #A5A5A5; font-weight: 500; font-size: 10px;">
                            ${500 - score} points left to ace that quiz.
                            </p>
                        </div>

                        <div class="score-main-bottom-right-container">
                            <p>${500 - score}</p>
                            <p style="color: #A5A5A5; font-weight: 500; font-size: 10px;">
                            ${(500 - score) / 100} answers incorrect.
                            </p>
                        </div>
                    </div>
                </div>
                `;

                nextQuizBtn.style.display = "none";
                
                const circle = document.querySelector(".progress-circle");
                const text = document.querySelector(".progress-text");

                function setProgress(percent) {
                percent = Math.min(Math.max(percent, 0), 100);
                const degrees = percent * 3.6;

                circle.style.background = `
                    conic-gradient(
                    #222 0deg ${degrees}deg,
                    #ddd ${degrees}deg 360deg
                    )
                `;

                text.textContent = `${Math.round(percent)}%`;
                }

                setProgress((score / 500) * 100);

                quizIndex = 0;
                score = 0;  
                isAnswered = false;
            }
        };

        startQuiz();
    }
});

const increaseWidth = (PB) => {
    const currentWidth = PB.offsetWidth;
    const parentWidth = PB.parentElement.offsetWidth;

    const currentPercent = (currentWidth / parentWidth) * 100;
    const newPercent = currentPercent + 20;

    PB.style.width = newPercent + "%";
};