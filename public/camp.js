const login = document.getElementById("login-btn");
const signup = document.getElementById("signup-btn");
const logout = document.getElementById("logout-bttn");
const cont = document.getElementById("container");

const user = JSON.parse(localStorage.getItem("user"));

if (user) {
    login.style.display = "none";
    signup.style.display = "none";
    logout.style.display = "block";
}

logout.addEventListener("click", () => {
    localStorage.removeItem("user");
    window.location.href = "index.html";
});

fetch("http://localhost:3000/campaigns?isApproved=true")
.then(res => res.json())
.then(data => {

    const params = new URLSearchParams(window.location.search);
    const campaignId = params.get("id");

    let remain = 0;

    fetch(`http://localhost:3000/pledges?campaignId=${campaignId}`)
    .then(res => res.json())
    .then(pledge => {

        fetch("http://localhost:3000/users")
        .then(res => res.json())
        .then(users => {

            let usersMap = {};
            users.forEach(u => {
                usersMap[u.id] = u.name;
            });

            let supportersHTML = "";
            let count = 0; 

            pledge.forEach(ele => {
                remain += ele.amount;
                count++;

                let username = usersMap[ele.userId] || "Unknown";

                supportersHTML += `
                <div style="display:flex;align-items:center;justify-content:space-between;gap:10px">
                    <span>${username}</span>
                    <span style="color:#1fa463">$${ele.amount}</span>
                </div>
                `;
            });

            data.forEach(element => {

                if (element.id == campaignId) {

                    const time = element.deadline;
                    const deadline = new Date(time);

                    const daysleft = Math.max(0, Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24)));

                    const html = `
<div id="left">

<h1 id="camp-head">${element.title}</h1>
<img id="camp-img" src="${element.img}" alt="campaign image">
<h2>About this project</h2>
<p id="details">${element.description}</p>

<h2>Recent supporters</h2>

<div id="support">
${supportersHTML}
<p style="text-align:center"></p>
</div>

</div>

<div id="right">

<div id="top-card">

<p style="display:flex;justify-content:space-between">

<span id="pledged" style="font-size:30px;font-weight:bold">
${remain}$
</span>

<span>
pledged of
<span style="color:#1fa463">${element.goal}$</span>
</span>

</p>

<progress id="progress" value="${Math.min(remain, element.goal)}" max="${element.goal}"></progress>

</div>

<div id="progress-update">

<p id="percent">${Math.min(100, ((remain / element.goal) * 100)).toFixed(1)}%</p>

<p>Backers: <span id="backers">${count}</span></p>

</div>

<hr>

<div id="days-left">
<p>${daysleft}</p>
<p>Days left</p>
</div>

<button id="back-project">Back This Project</button>

</div>
`;

                    cont.innerHTML = html;

                    const backBtn = document.getElementById("back-project");

                    if (deadline <= new Date()) {
                        backBtn.innerText = "Campaign Expired";
                        backBtn.disabled = true;
                    }

                    if (remain >= element.goal) {
                        backBtn.innerText = "Campaign Completed";
                        backBtn.disabled = true;
                    }

                    backBtn.addEventListener("click", () => {

                        const user = JSON.parse(localStorage.getItem("user"));

                        if (!user) {
                            alert("You must login first");
                            return;
                        }

                        const x = Number(prompt("Enter the money you want to fund"));

                        if (isNaN(x) || x <= 0) {
                            alert("Enter valid number");
                            return;
                        }

                        fetch("http://localhost:3000/pledges", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                campaignId: campaignId,
                                amount: x,
                                userId: user.id
                            })
                        })
                        .then(res => res.json())
                        .then(() => {

                            remain += x;
                            count++;

                            document.getElementById("pledged").innerText = remain + "$";

                            document.getElementById("percent").innerText =
                            Math.min(100, ((remain / element.goal) * 100)).toFixed(1) + "%";

                            document.getElementById("backers").innerText = count;

                            document.getElementById("progress").value = Math.min(remain, element.goal);

                            document.getElementById("support").innerHTML += `
                            <div style="display:flex;align-items:center;justify-content:space-between;gap:10px">
                                <span>${user.name}</span>
                                <span style="color:#1fa463">$${x}</span>
                            </div>
                            `;

                            if (deadline <= new Date()) {
                                alert("Fund Completed 🎉");
                                backBtn.disabled = true;
                                backBtn.innerText = "Campaign Completed";
                            }

                            if (remain >= element.goal) {
                                alert("Fund Completed 🎉");
                                backBtn.disabled = true;
                                backBtn.innerText = "Campaign Completed";
                            }

                        });

                    });

                }

            });

        });

    });

});