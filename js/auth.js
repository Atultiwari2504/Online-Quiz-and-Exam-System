function showForm(type) {
    document.getElementById("loginForm").classList.toggle("hidden", type !== "login");
    document.getElementById("registerForm").classList.toggle("hidden", type !== "register");
}

function register() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            email: email,
            password: password
        })
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);

        if (data.message === "User registered") {
            alert("Registered Successfully!");
            window.location.href = "login.html";
        } else {
            alert(data.message);
        }
    })
    .catch(err => console.error(err));
}

function loginUser() {
    fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            email: loginEmail.value,
            password: loginPassword.value
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === "success") {
            localStorage.setItem("currentUser", data.name);
            window.location.href = "dashboard.html";
        } else {
            alert("Invalid login");
        }
    });
}