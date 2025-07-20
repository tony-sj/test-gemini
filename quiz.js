document.addEventListener('DOMContentLoaded', () => {
    const questionEl = document.getElementById('question');
    const feedbackEl = document.getElementById('feedback');
    const nextButton = document.getElementById('next-button');
    const progressText = document.getElementById('progress-text');
    const scoreText = document.getElementById('score-text');
    
    const answerInput = document.getElementById('answer-input');
    const submitButton = document.getElementById('submit-button');

    const quizContainer = document.getElementById('quiz');
    const resultContainer = document.getElementById('result-container');
    const finalScoreEl = document.getElementById('final-score');
    const totalQuestionsEl = document.getElementById('total-questions');
    const restartButton = document.getElementById('restart-button');

    let quizData = [];
    let currentQuestionIndex = 0;
    let score = 0;

    async function loadQuizData() {
        try {
            const response = await fetch('quiz_data.csv');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const csvText = await response.text();
            
            Papa.parse(csvText, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    quizData = results.data;
                    if(quizData.length > 0) {
                        startQuiz();
                    } else {
                        questionEl.textContent = "퀴즈 데이터를 불러오는 데 실패했거나 데이터가 비어있습니다.";
                    }
                },
                error: (error) => {
                    questionEl.textContent = `CSV 파싱 오류: ${error.message}`;
                }
            });
        } catch (error) {
            questionEl.textContent = `퀴즈 데이터를 불러올 수 없습니다: ${error.message}`;
        }
    }

    function startQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        resultContainer.style.display = 'none';
        quizContainer.style.display = 'block';
        showQuestion();
    }

    function showQuestion() {
        resetState();
        const currentQuestion = quizData[currentQuestionIndex];
        questionEl.textContent = currentQuestion.question;
        updateProgress();
    }

    function resetState() {
        feedbackEl.textContent = '';
        nextButton.style.display = 'none';
        submitButton.style.display = 'block';
        answerInput.value = '';
        answerInput.disabled = false;
        answerInput.focus();
    }

    function checkAnswer() {
        const userAnswer = answerInput.value.trim();
        const correctAnswer = quizData[currentQuestionIndex].answer.trim();

        if (userAnswer === '') {
            feedbackEl.textContent = "정답을 입력해주세요.";
            feedbackEl.style.color = 'orange';
            return;
        }

        answerInput.disabled = true;
        submitButton.style.display = 'none';

        if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
            feedbackEl.textContent = "정답입니다!";
            feedbackEl.style.color = 'green';
            score++;
        } else {
            feedbackEl.textContent = `오답입니다. 정답은 "${correctAnswer}"입니다.`;
            feedbackEl.style.color = 'red';
        }
        
        updateProgress();
        nextButton.style.display = 'block';
    }
    
    function updateProgress() {
        scoreText.textContent = `점수: ${score}`;
        progressText.textContent = `문제 ${currentQuestionIndex + 1} / ${quizData.length}`;
    }

    function showResults() {
        quizContainer.style.display = 'none';
        resultContainer.style.display = 'block';
        finalScoreEl.textContent = score;
        totalQuestionsEl.textContent = quizData.length;
    }

    submitButton.addEventListener('click', checkAnswer);
    answerInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            checkAnswer();
        }
    });

    nextButton.addEventListener('click', () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < quizData.length) {
            showQuestion();
        } else {
            showResults();
        }
    });

    restartButton.addEventListener('click', startQuiz);

    loadQuizData();
});

