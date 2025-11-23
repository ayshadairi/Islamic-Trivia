let questionPool = [
    {
        question: "In Islam, who is considered the first Prophet?",
        answers: ["Abraham", "Moses", "Adam", "Muhammad"],
        correct: 2
    },
    {
        question: "Which prophet is known as the 'Friend of God' (Khalilullah) in Islam and is a central figure in Judaism and Christianity?",
        answers: ["Moses", "Jesus", "Abraham", "Noah"],
        correct: 2
    },
    {
        question: "Muslims believe that Jesus (Isa) was:",
        answers: ["The Son of God", "An angel in human form", "A righteous Prophet and the Messiah", "A fictional character"],
        correct: 2
    },
    {
        question: "Which holy book in Islam tells the story of Moses (Musa) and Pharaoh in great detail?",
        answers: ["The Bible", "The Torah", "The Psalms", "The Quran"],
        correct: 3
    },
    {
        question: "The Quran instructs Muslims to believe in the original scriptures revealed to:",
        answers: ["Only Prophet Muhammad", "Prophets Moses, Jesus, and Muhammad", "Only the Arab prophets", "Prophets after Muhammad"],
        correct: 1
    },
    {
        question: "In Islamic belief, who was the mother of Jesus?",
        answers: ["Mary (Maryam)", "Elizabeth", "Sarah", "Hagar (Hajar)"],
        correct: 0
    },
    {
        question: "Which city, holy to Judaism and Christianity, is the third holiest city in Islam?",
        answers: ["Mecca", "Medina", "Jerusalem", "Baghdad"],
        correct: 2
    },
    {
        question: "Muslims believe that the Kaaba in Mecca was originally built by:",
        answers: ["Prophet Muhammad", "Angels", "Prophet Abraham and his son Ishmael", "The first Caliph"],
        correct: 2
    },
    {
        question: "In Islam, which prophet survived being thrown into a fiery furnace?",
        answers: ["Moses", "Abraham", "Jesus", "Joseph"],
        correct: 1
    },
    {
        question: "What is the Arabic word for God, used by Arabic-speaking Christians and Jews as well?",
        answers: ["Ilah", "Rabb", "Allah", "Khaliq"],
        correct: 2
    },
    {
        question: "Which of these is NOT one of the five Pillars of Islam?",
        answers: ["Belief in One God", "Pilgrimage to Jerusalem", "Charity to the Poor", "Fasting in Ramadan"],
        correct: 1
    },
    {
        question: "Muslims believe that Prophet Muhammad was:",
        answers: ["The son of God", "The last in a long line of prophets", "An angel", "A divine being"],
        correct: 1
    },
    {
        question: "In Islamic tradition, which prophet's wife was visited by angels who foretold the birth of Isaac?",
        answers: ["Hagar (Hajar)", "Maryam (Mary)", "Sarah", "Asiya"],
        correct: 2
    },
    {
        question: "The Quran affirms the miracle of the:",
        answers: ["Parting of the Red Sea", "Resurrection of Lazarus", "Feeding of the 5000", "All of the above"],
        correct: 3
    },
    {
        question: "The Islamic greeting 'As-Salaam-Alaikum' means:",
        answers: ["Praise be to God", "Peace be upon you", "God is Great", "Thank God"],
        correct: 1
    }
];

let gameState = {
    currentQuestionIndex: 0,
    score: 0,
    questions: [],
    usedQuestionIndices: new Set()
};

const startScreen = document.getElementById('startScreen');
const questionScreen = document.getElementById('questionScreen');
const resultScreen = document.getElementById('resultScreen');
const endScreen = document.getElementById('endScreen');
const startBtn = document.getElementById('startBtn');
const nextBtn = document.getElementById('nextBtn');
const restartBtn = document.getElementById('restartBtn');
const answerForm = document.getElementById('answerForm');
const questionForm = document.getElementById('questionForm');

function initGame() {
    if (startBtn) {
        startBtn.addEventListener('click', startGame);
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', nextQuestion);
    }
    if (restartBtn) {
        restartBtn.addEventListener('click', restartGame);
    }
    if (answerForm) {
        answerForm.addEventListener('submit', handleAnswerSubmit);
    }
    if (questionForm) {
        questionForm.addEventListener('submit', handleQuestionSubmit);
    }

    loadSavedQuestions();
}

function loadSavedQuestions() {
    const savedQuestions = localStorage.getItem('customQuestions');
    if (savedQuestions) {
        const customQuestions = JSON.parse(savedQuestions);
        questionPool = [...questionPool, ...customQuestions];
    }
}

function startGame() {
    gameState.questions = selectRandomQuestions(10);
    gameState.currentQuestionIndex = 0;
    gameState.score = 0;
    gameState.usedQuestionIndices.clear();
    
    updateGameInfo();
    showScreen(questionScreen);
    displayQuestion();
}
function selectRandomQuestions(count) {
    const selected = [];
    const availableIndices = [...Array(questionPool.length).keys()];
    
    for (let i = 0; i < count && availableIndices.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * availableIndices.length);
        const questionIndex = availableIndices.splice(randomIndex, 1)[0];
        selected.push(questionPool[questionIndex]);
        gameState.usedQuestionIndices.add(questionIndex);
    }
    
    return selected;
}

function displayQuestion() {
    if (gameState.currentQuestionIndex >= gameState.questions.length) {
        endGame();
        return;
    }
    
    const currentQuestion = gameState.questions[gameState.currentQuestionIndex];
    
    document.getElementById('questionText').textContent = currentQuestion.question;
    document.getElementById('option1').textContent = currentQuestion.answers[0];
    document.getElementById('option2').textContent = currentQuestion.answers[1];
    document.getElementById('option3').textContent = currentQuestion.answers[2];
    document.getElementById('option4').textContent = currentQuestion.answers[3];

    const radioButtons = document.querySelectorAll('input[name="answer"]');
    radioButtons.forEach(radio => radio.checked = false);
    
    updateGameInfo();
}
function handleAnswerSubmit(event) {
    event.preventDefault();
    
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');
    if (!selectedAnswer) {
        alert('Please select an answer!');
        return;
    }
    
    const answerIndex = parseInt(selectedAnswer.value);
    const currentQuestion = gameState.questions[gameState.currentQuestionIndex];
    if (answerIndex === currentQuestion.correct) {
        gameState.score++;
        showResult(true, currentQuestion.answers[currentQuestion.correct]);
    } else {
        showResult(false, currentQuestion.answers[currentQuestion.correct]);
    }
}

function showResult(isCorrect, correctAnswer) {
    const resultTitle = document.getElementById('resultTitle');
    const resultMessage = document.getElementById('resultMessage');
    
    if (isCorrect) {
        resultTitle.textContent = 'Correct! 🎉';
        resultTitle.style.color = '#90EE90';
        resultMessage.textContent = `Well done! "${correctAnswer}" is the correct answer.`;
    } else {
        resultTitle.textContent = 'Incorrect';
        resultTitle.style.color = '#FFB6C1';
        resultMessage.textContent = `The correct answer was: "${correctAnswer}"`;
    }
    
    showScreen(resultScreen);
}

function nextQuestion() {
    gameState.currentQuestionIndex++;
    
    if (gameState.currentQuestionIndex < gameState.questions.length) {
        showScreen(questionScreen);
        displayQuestion();
    } else {
        endGame();
    }
}

function endGame() {
    const finalScore = document.getElementById('finalScore');
    const scoreMessage = document.getElementById('scoreMessage');
    
    finalScore.textContent = gameState.score;

    if (gameState.score >= 9) {
        scoreMessage.textContent = 'Excellent! You have deep knowledge of the Abrahamic tradition!';
    } else if (gameState.score >= 7) {
        scoreMessage.textContent = 'Great job! You understand the connections well.';
    } else if (gameState.score >= 5) {
        scoreMessage.textContent = 'Good effort! Review the "Shared Legacy" page to learn more.';
    } else {
        scoreMessage.textContent = 'Keep learning! Visit the "Shared Legacy" page to understand the connections better.';
    }
    
    showScreen(endScreen);
}

function restartGame() {
    showScreen(startScreen);
}

function updateGameInfo() {
    const currentQuestionElement = document.getElementById('currentQuestion');
    const currentScoreElement = document.getElementById('currentScore');
    
    if (currentQuestionElement) {
        currentQuestionElement.textContent = gameState.currentQuestionIndex + 1;
    }
    if (currentScoreElement) {
        currentScoreElement.textContent = gameState.score;
    }
}

function showScreen(screen) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.remove('active'));

    screen.classList.add('active');
}

function handleQuestionSubmit(event) {
    event.preventDefault();
    
    const question = document.getElementById('question').value;
    const answer1 = document.getElementById('answer1').value;
    const answer2 = document.getElementById('answer2').value;
    const answer3 = document.getElementById('answer3').value;
    const answer4 = document.getElementById('answer4').value;
    const correctAnswer = parseInt(document.getElementById('correctAnswer').value) - 1;

    if (!question || !answer1 || !answer2 || !answer3 || !answer4 || isNaN(correctAnswer)) {
        showFormMessage('Please fill in all fields and select the correct answer.', 'error');
        return;
    }

    const newQuestion = {
        question: question,
        answers: [answer1, answer2, answer3, answer4],
        correct: correctAnswer
    };

    questionPool.push(newQuestion);
    saveCustomQuestions();
    showFormMessage('Question added successfully! Thank you for your contribution.', 'success');
    event.target.reset();
}

function saveCustomQuestions() {
    const customQuestions = questionPool.slice(15);
    localStorage.setItem('customQuestions', JSON.stringify(customQuestions));
}

function showFormMessage(message, type) {
    const messageElement = document.getElementById('formMessage');
    messageElement.textContent = message;
    messageElement.className = `form-message ${type}`;

    if (type === 'success') {
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 3000);
    }
}
document.addEventListener('DOMContentLoaded', initGame);