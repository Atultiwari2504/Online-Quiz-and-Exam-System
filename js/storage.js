function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

function getQuestions() {
    return JSON.parse(localStorage.getItem("questions")) || [];
}

function saveQuestions(questions) {
    localStorage.setItem("questions", JSON.stringify(questions));
}

function setCurrentUser(user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
}

function getCurrentUser() {
    return localStorage.getItem("currentUser");
}