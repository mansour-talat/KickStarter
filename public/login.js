const form = document.getElementById("form");
const wrong = document.getElementById("wrong-cred");
const bcrypt = dcodeIO.bcrypt;

form.addEventListener("submit",async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    fetch(`http://localhost:3000/users?email=${email}`)
        .then(res => res.json())
        .then(async (data) => {
            const user = data.find(u => u.email === email);
            if (!user) {
                wrong.style.display = "block";
                return;
            }
            if (user.role === "admin" &&await bcrypt.compare(password, user.password)) {
                localStorage.setItem("user", JSON.stringify(user));
                window.location.href = "admindash.html";
            }

            if (user.isActive === false) {
                alert("You are banned");
                return;
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                console.log("Login success", user);
                localStorage.setItem("user", JSON.stringify(user));
                window.location.href = "index.html";
            } else {
                wrong.style.display = "block";
            }
        })
        .catch(err => {
            console.error("Login error:", err);
            wrong.style.display = "block";
        });
});