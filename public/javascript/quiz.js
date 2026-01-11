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
    const quizzes = response.message;

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
            <span>${currentQuiz.options[answer]}</span>
            <div class="circle"><span class="material-symbols-outlined">check</span></div>
            `;

            document.querySelector(`.explanation-${answer}`).style.padding = '5px 15px';
            document.querySelector(`.explanation-${answer}`).style.display = 'flex';
        } else {
            document.querySelector(`.option-${answer}`).innerHTML = `
            <span>${currentQuiz.options[answer]}</span>
            <div class="circle"><span class="material-symbols-outlined">close</span></div>
            `;

            document.querySelector(`.option-${currentQuiz.answer}`).style.border = '2px solid #2a2a2a';
            document.querySelector(`.option-${currentQuiz.answer}`).innerHTML = `
            <span>${currentQuiz.options[currentQuiz.answer]}</span>
            <div class="circle"><span class="material-symbols-outlined">check</span></div>
            `;

            document.querySelector(`.explanation-${currentQuiz.answer}`).style.padding = '5px 15px';
            document.querySelector(`.explanation-${currentQuiz.answer}`).style.display = 'flex';
        }
    };

    if (response.success) {
        window.startQuiz = () => {
            let quiz = quizzes[quizIndex];
            
            let currentQuizHTML = `<h3 style="font-size: 16px;">${quiz.question}</h3>`
            currentQuizHTML += quiz.options.map((options, index) => {
                return `
                <button class="options option-${index}" onclick="check(${index})">${options}</button>
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

            if (quizIndex < quizzes.length) {
                startQuiz();
                nextQuizBtn.disabled = true;
                isAnswered = false;
            } else {
                quizContainer.innerHTML = `<h1>Score: ${score}</h1>`;
            }
        };

        startQuiz();
    }
});