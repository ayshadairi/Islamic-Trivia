function initializeNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage) {
            link.classList.add('active');
        }
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
        });
    });
}

function displayMyQuestions() {
    const savedQuestions = localStorage.getItem('customQuestions');
    const questionsList = document.getElementById('myQuestionsList');
    
    if (!questionsList) return;
    
    if (savedQuestions) {
        try {
            const customQuestions = JSON.parse(savedQuestions);
            
            if (customQuestions.length === 0) {
                questionsList.innerHTML = '<p class="question-item">No questions added yet.</p>';
                return;
            }
            
            let html = '';
            customQuestions.forEach((q, index) => {
                html += `
                    <div class="question-item">
                        <strong>Q${index + 1}:</strong> ${q.question.substring(0, 60)}...
                        <br><small>Correct: ${q.answers[q.correct]}</small>
                    </div>
                `;
            });
            
            questionsList.innerHTML = html;
        } catch (error) {
            questionsList.innerHTML = '<p class="question-item">Error loading questions.</p>';
        }
    } else {
        questionsList.innerHTML = '<p class="question-item">No questions added yet.</p>';
    }
}

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

function loadSavedQuestions() {
    const savedQuestions = localStorage.getItem('customQuestions');
    if (savedQuestions) {
        try {
            const customQuestions = JSON.parse(savedQuestions);
            
            questionPool = [
                ...questionPool.slice(0, 15),
                ...customQuestions
            ];
            
        } catch (error) {
            console.error('Error loading saved questions:', error);
        }
    }
}

function saveCustomQuestions() {
    const customQuestions = questionPool.slice(15);
    localStorage.setItem('customQuestions', JSON.stringify(customQuestions));
}

let gameState = {
    currentQuestionIndex: 0,
    score: 0,
    questions: [],
    usedQuestionIndices: new Set()
};

function initGame() {
    if (document.getElementById('startBtn')) {
        document.getElementById('startBtn').addEventListener('click', startGame);
    }
    if (document.getElementById('nextBtn')) {
        document.getElementById('nextBtn').addEventListener('click', nextQuestion);
    }
    if (document.getElementById('restartBtn')) {
        document.getElementById('restartBtn').addEventListener('click', restartGame);
    }
    if (document.getElementById('answerForm')) {
        document.getElementById('answerForm').addEventListener('submit', handleAnswerSubmit);
    }
    if (document.getElementById('questionForm')) {
        document.getElementById('questionForm').addEventListener('submit', handleQuestionSubmit);
    }
    
    loadSavedQuestions();
    updateDebugInfo();
}

function startGame() {
    gameState.questions = selectRandomQuestions(10);
    gameState.currentQuestionIndex = 0;
    gameState.score = 0;
    gameState.usedQuestionIndices.clear();
    
    updateGameInfo();
    showScreen(document.getElementById('questionScreen'));
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
    }
    
    updateGameInfo();
    
    if (answerIndex === currentQuestion.correct) {
        showResult(true, currentQuestion.answers[currentQuestion.correct]);
    } else {
        showResult(false, currentQuestion.answers[currentQuestion.correct]);
    }
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
    
    showFormMessage(`Question added successfully! Total questions: ${questionPool.length}`, 'success');
    
    displayMyQuestions();
    updateCustomCount();
    
    event.target.reset();
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
    
    showScreen(document.getElementById('resultScreen'));
}

function nextQuestion() {
    gameState.currentQuestionIndex++;
    
    if (gameState.currentQuestionIndex < gameState.questions.length) {
        showScreen(document.getElementById('questionScreen'));
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
    
    showScreen(document.getElementById('endScreen'));
}

function restartGame() {
    showScreen(document.getElementById('startScreen'));
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
    screens.forEach(s => s.classList.remove('active'));
    screen.classList.add('active');
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

function updateCustomCount() {
    const customCount = document.getElementById('customCount');
    const questionsList = document.getElementById('myQuestionsList');
    
    if (customCount) {
        const savedQuestions = localStorage.getItem('customQuestions');
        if (savedQuestions) {
            try {
                const customQuestions = JSON.parse(savedQuestions);
                customCount.textContent = customQuestions.length;
                
                if (customQuestions.length === 0) {
                    questionsList.innerHTML = '<p class="question-item">No questions added yet.</p>';
                }
            } catch (error) {
                customCount.textContent = '0';
            }
        } else {
            customCount.textContent = '0';
        }
    }
}

function resetCustomQuestions() {
    if (confirm('Are you sure you want to delete ALL custom questions? This cannot be undone.')) {
        localStorage.removeItem('customQuestions');
        
        questionPool = questionPool.slice(0, 15);
        
        showFormMessage('All custom questions have been reset.', 'success');
        
        displayMyQuestions();
        updateCustomCount();
        
    }
}

function initResetButton() {
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetCustomQuestions);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    
    if (document.getElementById('gameArea') || document.getElementById('questionForm')) {
        initGame();
    }
    
    displayMyQuestions();
    updateCustomCount();
    initResetButton();
});