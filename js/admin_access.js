const adminLoginForm = document.getElementById("adminLoginForm");
adminLoginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    adminLogin();
});
function adminLogin() {
    const username = document.getElementById("adminUsername").value;
    const password = document.getElementById("adminPassword").value;

    if (username === "admin" && password === "admin123") {
        localStorage.setItem("adminAuth", "true");
        alert("Admin login successful!");
        window.location.href = "admin.html";
    } else {
        alert("Invalid admin credentials!");
    }
}

function logout() {
    localStorage.removeItem("adminAuth");
    window.location.href = "admin_login.html";
}