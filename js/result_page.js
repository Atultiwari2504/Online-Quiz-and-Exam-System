const result = JSON.parse(localStorage.getItem("quizResult"));

document.getElementById("score").innerText =
    `Score: ${result.score} / ${result.total}`;

document.getElementById("percent").innerText =
    `Percentage: ${result.percent}%`;