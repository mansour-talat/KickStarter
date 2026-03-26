const titleInput = document.getElementById("title");
const deadlineInput = document.getElementById("deadline");
const goalInput = document.getElementById("goal");
const descInput = document.getElementById("desc");
const bannerInput = document.getElementById("banner");
const form = document.querySelector("form");

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }

    const file = bannerInput.files[0];

    let imgData = "";
    if (file) {
        imgData = await fileToBase64(file);
    }



    fetch("http://localhost:3000/campaigns", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: titleInput.value,
            creatorId: user.id,
            goal: Number(goalInput.value),
            deadline: deadlineInput.value,
            isApproved: false,
            description: descInput.value,
            img: imgData
        })
    })
        .then(res => res.json())
        .then(data => {
            console.log("Created:", data);
            alert("Campaign submitted for approval ");
            window.location.href = "index.html";
        })
        .catch(err => console.log(err));
});