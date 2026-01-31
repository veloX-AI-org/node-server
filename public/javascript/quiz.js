const uploadYoutubeURLBtn = document.getElementById('uploadYoutubeURL');
const quizContainer = document.querySelector('.quiz-container');
const nextQuizBtn = document.getElementById('nextQuizBtn');

nextQuizBtn.disabled = true;

uploadYoutubeURLBtn.addEventListener("click", async() => {
    const youtubeURLLink = document.getElementById('youtubeURLLink').value;

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
                'content-Type': 'application/json'
            },
            body: JSON.stringify({ youtubeURLLink })
        }
    );

    uploadYoutubeURLBtn.innerHTML = `Upload`;

    const response = await quizResponse.json();
    nextQuizBtn.style.display = 'flex';
    const quizzes = response['message'];
    console.log(quizzes);
    console.log(response);

    let quizIndex = 0;
    let score = 0;  
    let isAnswered = false;

    window.check = (answer) => {
        if (isAnswered) return;

        isAnswered = true;
        nextQuizBtn.disabled = false;

        let currentQuiz = quizzes[quizIndex];

        if (answer == currentQuiz.answer) {
            score += 10;
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

    if (response.success) {
        window.startQuiz = () => {
            let quiz = quizzes[quizIndex];
            
            let currentQuizHTML = `<p style="font-size: 15px; text-align: center;font-weight: 500;">${quiz.question}</p>`
            currentQuizHTML += quiz.options.map((options, index) => {
                return `
                <button class="options option-${index}" onclick="check(${index})"><span style="text-align: left;">${options}</span></button>
                <div class="explanations explanation-${index}">
                    <div class="explanation-vertical-line"></div>
                    <p>
                        <font style="font-weight: 500;">Explanation</font>
                        Explanation: ${quiz.explanation}
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
                quizContainer.innerHTML = `<h1>Score: ${score}</h1>`;
                nextQuizBtn.style.display = 'none';
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