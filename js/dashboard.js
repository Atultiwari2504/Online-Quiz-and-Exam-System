function logoutUser() {
    localStorage.removeItem("adminAuth");
    window.location.href = "login.html";
}

window.onload = function () {
    const user = localStorage.getItem("currentUser");

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    document.getElementById("userWelcome").innerText = `Welcome, ${user}`;

    loadCategories();
    loadRecentAttempts(); // 👈 ADD THIS
};

function loadRecentAttempts() {
    const attempts = JSON.parse(localStorage.getItem("attempts")) || [];
    const user = localStorage.getItem("currentUser");

    const list = document.getElementById("attemptList");
    list.innerHTML = "";

    const myAttempts = attempts
        .filter(a => a.name && a.name.toLowerCase() === user.toLowerCase())
        .slice(-5)
        .reverse();

    if (myAttempts.length === 0) {
        list.innerHTML = "<p>No attempts yet</p>";
        return;
    }

    myAttempts.forEach(a => {
        list.innerHTML += `
            <div class="card">
                <p><b>${a.name}</b> - ${a.category}</p>
                <p>Score: ${a.score}/${a.total} (${a.percent}%)</p>
                <p>${a.date}</p>
            </div>
        `;
    });
}

function loadCategories() {
    fetch("http://127.0.0.1:5000/categories")
        .then(res => res.json())
        .then(data => {
            console.log("CATEGORIES FROM BACKEND:", data); // 🔥 DEBUG

            const list = document.getElementById("categoryList");
            list.innerHTML = "";

            data.forEach(cat => {
                const btn = document.createElement("button");
                btn.className = "btn";
                btn.innerText = cat;

                btn.onclick = function () {
                    startQuiz(cat);
                };

                list.appendChild(btn);
            });
        })
        .catch(err => console.error("ERROR:", err));
}

function startQuiz(category) {
    localStorage.setItem("selectedCategory", category);
    window.location.href = "quiz.html";
}