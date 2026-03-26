const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const form = document.getElementById("form");
const bcrypt = dcodeIO.bcrypt;
console.log(bcrypt);


form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = nameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;

    const hashedPassword = await bcrypt.hash(password, 10);

    const res = await fetch("http://localhost:3000/users");
    const users = await res.json();

    const exists = users.some(u => u.email === email);

    if (exists) {
        console.log("email taken");
        alert("email is taken")
        return;
    }   

     await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            email: email,
            role: "user",
            password: hashedPassword,
            isActive: true
        })
    });
    alert("User created");
    window.location.href="login.html"
});