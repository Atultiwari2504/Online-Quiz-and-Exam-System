let currentIndex = 0;
let timer;
let timeLeft = 30;

// store answers (important)
let userAnswers = [];

const category = localStorage.getItem("selectedCategory");
let questions = [];

function loadQuestionsFromBackend() {
    fetch(`http://127.0.0.1:5000/questions/${category}`)
        .then(res => res.json())
        .then(data => {
            questions = data;

            userAnswers = new Array(questions.length).fill(null);

            loadQuestion();
        })
        .catch(err => console.error(err));
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").innerText = `Time: ${timeLeft}s`;

        if (timeLeft <= 0) {
            nextQuestion();
        }
    }, 1000);
}

function loadQuestion() {
    if (questions.length === 0) {
    document.body.innerHTML = "<h2>No questions found</h2>";
    return;
}
    if (currentIndex >= questions.length) {
        finishQuiz();
        return;
    }

    timeLeft = 30;
    clearInterval(timer);
    startTimer();

    const q = questions[currentIndex];

    document.getElementById("question").innerText =
        `${currentIndex + 1}. ${q.question}`;

    const optionsDiv = document.getElementById("options");
    optionsDiv.innerHTML = "";

    q.options.forEach((opt, i) => {
        const isSelected = userAnswers[currentIndex] === i ? "selected" : "";

        optionsDiv.innerHTML += `
            <button class="btn full option-btn ${isSelected}" 
                onclick="selectOption(${i})">
                ${opt}
            </button>
        `;
    });

    updateNavButtons();
}

// save selected answer
function selectOption(index) {
    userAnswers[currentIndex] = index;
    loadQuestion();
}

// NEXT BUTTON
function nextQuestion() {
    if (currentIndex < questions.length - 1) {
        currentIndex++;
        loadQuestion();
    } else {
        finishQuiz();
    }
}

// PREVIOUS BUTTON
function prevQuestion() {
    if (currentIndex > 0) {
        currentIndex--;
        loadQuestion();
    }
}

// enable/disable buttons
function updateNavButtons() {
    document.getElementById("prevBtn").disabled = currentIndex === 0;
    document.getElementById("nextBtn").innerText =
        currentIndex === questions.length - 1 ? "Finish" : "Next";
}

// FINAL RESULT
function finishQuiz() {
    clearInterval(timer);

    let score = 0;

    questions.forEach((q, i) => {
        if (userAnswers[i] === q.correctIndex) {
            score++;
        }
    });

    const percent = ((score / questions.length) * 100).toFixed(2);

    // ✅ SAVE ATTEMPT
    let attempts = JSON.parse(localStorage.getItem("attempts")) || [];

    const user = getCurrentUser();

    attempts.push({
        name: user,
        category: category,
        score: score,
        total: questions.length,
        percent: percent,
        date: new Date().toLocaleString()
    });

    localStorage.setItem("attempts", JSON.stringify(attempts));

    // RESULT UI
    document.body.innerHTML = `
        <div class="page-center">
            <div class="card">
                <h2>Quiz Completed 🎉</h2>
                <p>Score: ${score} / ${questions.length}</p>
                <p>Percentage: ${percent}%</p>
                <a class="btn" href="dashboard.html">Back to Dashboard</a>
            </div>
        </div>
    `;
    fetch("http://127.0.0.1:5000/save-attempt", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: user,
            category: category,
            score: score,
            total: questions.length,
            percent: percent,
            date: new Date().toLocaleString()
        })
    });
}

window.onload = loadQuestionsFromBackend;

