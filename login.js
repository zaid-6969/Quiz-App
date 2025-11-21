let login = document.getElementById("login");
let sign = document.getElementById("sign");
let email = document.getElementById("email");
let password = document.getElementById("password");

const API_URL = "https://6920098f31e684d7bfcb71de.mockapi.io/api/v1/log";

login.addEventListener("click", async () => {
    if (!email.value || !password.value) {
        return alert("Please enter your email and password");
    }

    try {
        const res = await fetch(API_URL);
        const users = await res.json();

        const user = users.find((u) => u.email === email.value.trim());

        if (!user) {
            return alert("Email doesn’t exist");
        }

        if (user.password !== password.value.trim()) {
            return alert("Wrong password");
        }

        localStorage.setItem("loggedUser", JSON.stringify(user));
        window.location.href = "index.html";
    } catch (err) {
        alert("Error connecting to server");
        console.error(err);
    }
});

sign.addEventListener("click", async () => {
    if (!email.value || !password.value) {
        return alert("Please enter your email and password");
    }

    try {
        const res = await fetch(API_URL);
        const users = await res.json();

        const exists = users.find((u) => u.email === email.value.trim());

        if (exists) {
            return alert("Email already registered!");
        }

        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: email.value.trim(),
                password: password.value.trim(),
            }),
        });
        window.location.href = "index.html";
        alert("Account created. Please login now!");
    } catch (err) {
        alert("Error connecting to server");
        console.error(err);
    }
});