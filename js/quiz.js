const currentUser = getCurrentUser();
if (!currentUser) {
    window.location.href = "login.html";
}

const selectedCategory = getData(SELECTED_CATEGORY_KEY, null);
if (!selectedCategory) {
    window.location.href = "dashboard.html";
}

document.getElementById("quizTitle").innerText = `${selectedCategory} Quiz`;

let allQuestions = getData(QUESTIONS_KEY, []).filter(q => q.category === selectedCategory);

if (!allQuestions.length) {
    alert("No questions available for this category.");
    window.location.href = "dashboard.html";
}

let currentIndex = 0;
let selectedAnswers = new Array(allQuestions.length).fill(null);

let totalSeconds = allQuestions.length * 60;
let timerInterval = null;

function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function startTimer() {
    document.getElementById("timer").innerText = formatTime(totalSeconds);
    timerInterval = setInterval(() => {
        totalSeconds--;
        document.getElementById("timer").innerText = formatTime(totalSeconds);
        if (totalSeconds <= 0) {
            clearInterval(timerInterval);
            submitQuiz();
        }
    }, 1000);
}

function renderQuestion() {
    const q = allQuestions[currentIndex];
    document.getElementById("questionCounter").innerText = `Question ${currentIndex + 1} of ${allQuestions.length}`;
    document.getElementById("questionText").innerText = q.question;

    const optionsDiv = document.getElementById("options");
    optionsDiv.innerHTML = q.options.map((opt, i) => `
    <button class="option-btn ${selectedAnswers[currentIndex] === i ? "selected" : ""}" onclick="selectOption(${i})">
      ${opt}
    </button>
  `).join("");
}

function selectOption(index) {
    selectedAnswers[currentIndex] = index;
    renderQuestion();
}

function nextQuestion() {
    if (currentIndex < allQuestions.length - 1) {
        currentIndex++;
        renderQuestion();
    }
}

function prevQuestion() {
    if (currentIndex > 0) {
        currentIndex--;
        renderQuestion();
    }
}

function finishQuiz() {
    clearInterval(timer);

    let score = 0;

    questions.forEach((q, i) => {
        if (userAnswers[i] === q.correctIndex) {
            score++;
        }
    });

    const percent = ((score / questions.length) * 100).toFixed(2);

    localStorage.setItem("quizResult", JSON.stringify({
        score: score,
        total: questions.length,
        percent: percent
    }));

    window.location.href = "result.html";
}

window.nextQuestion = nextQuestion;
window.prevQuestion = prevQuestion;
window.finishQuiz = finishQuiz;
window.selectOption = selectOption;

startTimer();
renderQuestion();