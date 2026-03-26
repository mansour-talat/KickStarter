const campaignsContainer = document.getElementById("campaigns");

fetch("http://localhost:3000/campaigns?isApproved=true")
    .then(res => res.json())
    .then(campaigns => {

        fetch("http://localhost:3000/pledges")
            .then(res => res.json())
            .then(pledges => {

                campaignsContainer.innerHTML = "";

                campaigns.slice(0, 4).forEach(camp => {

                    let raised = 0;

                    pledges.forEach(p => {
                        if (p.campaignId == camp.id) {
                            raised += p.amount;
                        }
                    });

                    
                    const deadline = new Date(camp.deadline);
                    const daysLeft = Math.ceil(
                        (deadline - new Date()) / (1000 * 60 * 60 * 24)
                    );

                    const html = `
                <div class="camp-card">
                    <img src="${camp.img}" alt="${camp.title}">
                    <div class="card-body">
                        <h3>${camp.title}</h3>

                        <progress value="${raised}" max="${camp.goal}"></progress>

                        <div class="card-footer">
                            <p><b>$${raised}</b> of $${camp.goal}</p>
                            <p><b>${daysLeft}</b> days left</p>

                            <button class="fundme-btn" data-id="${camp.id}">
                                Fund me
                            </button>
                        </div>
                    </div>
                </div>
            `;

                    campaignsContainer.innerHTML += html;
                });

                campaignsContainer.addEventListener("click", (e) => {

                    if (e.target.classList.contains("fundme-btn")) {

                        const user = JSON.parse(localStorage.getItem("user"));

                        if (!user) {
                            alert("Please log in to fund a campaign");
                            window.location.href = "login.html";
                        }
                        else {
                            const campaignId = e.target.dataset.id;
                            window.location.href = `camp.html?id=${campaignId}`;
                        }

                    }

                });

                    document.querySelector(".hero-btn").addEventListener("click", (e) => {

                    

                        const user = JSON.parse(localStorage.getItem("user"));

                        if (!user) {
                            alert("Please log in to start a campaign");
                            window.location.href = "login.html";
                        }
                        else {
                            window.location.href = "makecamp.html";
                        }



                });

            });

    })
    .catch(err => console.log(err));



const login = document.getElementById("login-btn");
const signup = document.getElementById("signup-btn");
const logout = document.getElementById("logout-bttn");

const user = JSON.parse(localStorage.getItem("user"));
if(user.role=="admin"){
    window.location.href="admindash.html"
}
if (user) {
    login.style.display = "none";
    signup.style.display = "none";
    logout.style.display = "block";
}

logout.addEventListener("click", () => {
    localStorage.removeItem("user");
    window.location.href = "index.html";
});
document.querySelector("#nav-links").addEventListener("click", (e) => {
    if(e.target.closest(".clicker")){
    if ( !user) {
        e.preventDefault();
        alert("please login to continue");
        window.location.href = "login.html";
    }
    }
});