function addQuestion() {
    const category = document.getElementById("category").value;
    const question = document.getElementById("question").value;

    const opt1 = document.getElementById("opt1").value;
    const opt2 = document.getElementById("opt2").value;
    const opt3 = document.getElementById("opt3").value;
    const opt4 = document.getElementById("opt4").value;

    const correctIndex = document.getElementById("correctIndex").value;

    fetch("http://127.0.0.1:5000/add-question", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            category: category,
            question: question,
            opt1: opt1,
            opt2: opt2,
            opt3: opt3,
            opt4: opt4,
            correctIndex: correctIndex
        })
    })
    .then(res => res.json())
    .then(data => {
        alert("Question Added!");
        console.log(data);
    })
    .catch(err => console.error(err));
    loadQuestions();
}

function deleteQuestion(id) {
    console.log("DELETE ID:", id); // 🔥 debug

    if (!confirm("Delete this question?")) return;

    fetch(`http://127.0.0.1:5000/delete-question/${id}`, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
        alert("Deleted!");
        loadQuestions();
    })
    .catch(err => console.error(err));
}

function loadQuestions() {
    fetch("http://127.0.0.1:5000/questions")
        .then(res => res.json())
        .then(data => {
            const list = document.getElementById("questionList");
            list.innerHTML = "";

            data.forEach((q, index) => {
                list.innerHTML += `
                    <div class="card">
                        <p><b>Q${index + 1}:</b> ${q.question}</p>
                        <p><b>Category:</b> ${q.category}</p>

                        <ul>
                            ${q.options.map(opt => `<li>${opt}</li>`).join("")}
                        </ul>

                        <p><b>Correct:</b> ${q.options[q.correctIndex]}</p>

                        <button class="btn danger" onclick="deleteQuestion(${q.id})">
                            Delete
                        </button>
                    </div>
                `;
            });
        });
}

window.onload = function () {
    loadQuestions();
};