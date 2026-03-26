const campaignsContainer = document.getElementById("campaigns");
const searchbar = document.getElementById("searchcamp");

let allCampaigns = [];
let allPledges = [];

fetch("http://localhost:3000/pledges")
    .then(res => res.json())
    .then(pledges => {
        allPledges = pledges;

        fetch("http://localhost:3000/campaigns?isApproved=true")
            .then(res => res.json())
            .then(campaigns => {
                allCampaigns = campaigns;
                render(allCampaigns);
            });
    })
    .catch(err => console.log(err));

function render(campaigns) {
    campaignsContainer.innerHTML = "";

    campaigns.forEach(camp => {
        let raised = 0;

        allPledges.forEach(p => {
            if (p.campaignId == camp.id) {
                raised += p.amount;
            }
        });

        const deadline = new Date(camp.deadline);
        const daysLeft = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24));

        let status = "Active";
        let statusClass = "active";

        if (raised >= camp.goal) {
            status = "Completed";
            statusClass = "completed";
        } else if (daysLeft <= 0) {
            status = "Expired";
            statusClass = "expired";
        }

        campaignsContainer.innerHTML += `
        <div class="camp-card">
            <div class="img-wrapper">
                <img src="${camp.img}" alt="${camp.title}">
                <span class="status ${statusClass}">${status}</span>
            </div>
            <div class="card-body">
                <h3>${camp.title}</h3>

                <progress value="${raised}" max="${camp.goal}"></progress>

                <div class="card-footer">
                    <p><b>$${raised}</b> of $${camp.goal}</p>
                    <p><b>${daysLeft}</b> days left</p>

                   <button class="fundme-btn" data-id="${camp.id}" 
    ${status !== "Active" ? "disabled" : ""}>
    ${status === "Completed" ? "Completed" : status === "Expired" ? "Expired" : "Fund me"}
</button>
                </div>
            </div>
        </div>
        `;
    });
}

searchbar.addEventListener("input", () => {
    const value = searchbar.value.toLowerCase();

    const filtered = allCampaigns.filter(c =>
        c.title.toLowerCase().includes(value)
    );

    render(filtered);
});

campaignsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("fundme-btn")) {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user) {
            alert("Please log in to fund a campaign");
            window.location.href = "login.html";
        } else {
            const campaignId = e.target.dataset.id;
            window.location.href = `camp.html?id=${campaignId}`;
        }
    }
});

const login = document.getElementById("login-btn");
const signup = document.getElementById("signup-btn");
const logout = document.getElementById("logout-bttn");

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