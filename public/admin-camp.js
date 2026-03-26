const camp_table = document.querySelector("#camp-table");
const dialog = document.getElementById("camp-dialog");

const d_title = document.getElementById("d-title");
const d_goal = document.getElementById("d-goal");
const d_deadline = document.getElementById("d-deadline");
const d_description = document.getElementById("d-description");

const closeBtn = document.getElementById("close-dialog-btn");
const pledgesDialog = document.getElementById("pledges-dialog");
const pledgesContainer = document.getElementById("pledges-container");
const closePledgesBtn = document.getElementById("close-pledges-btn");
fetch("http://localhost:3000/campaigns")
    .then(res => res.json())
    .then(camps => {

        document.querySelector("#camp-num").textContent = camps.length;

        camps.forEach(element => {

            let color = element.isApproved ? "green" : "red";
            let stat = element.isApproved ? "Accepted" : "Pending";

            let row = document.createElement("tr");

            row.innerHTML = `
                <td><img class="camp-img" src="${element.img}" width="50"></td>
                <td class="camp-title">${element.title}</td>
                <td>
                    <span class="status" style="background-color:${color}; color:white;">
                        ${stat}
                    </span>
                </td>
                <td><button class="view-btn">View</button></td>
                <td class="action" data-id="${element.id}">
                    <button class="accept-btn">Accept</button>
                    <button class="reject-btn" style="background-color:#dc3545">Delete</button>
                    <button class="ban-btn" style="background-color:#8b0000">Ban</button>
                <td><button class="view-pledge-btn">View Pledges</button></td>

                </td>
            `;
            camp_table.appendChild(row);


            const statusEl = row.querySelector(".status");
            const acceptBtn = row.querySelector(".accept-btn");
            const rejectBtn = row.querySelector(".reject-btn");
            const banBtn = row.querySelector(".ban-btn");

            if (element.isApproved) {
                acceptBtn.style.display = "none";
                rejectBtn.style.display = "inline-block";
                banBtn.style.display = "inline-block";
            } else {
                acceptBtn.style.display = "inline-block";
                rejectBtn.style.display = "inline-block";
                banBtn.style.display = "none";
            }

            acceptBtn.addEventListener("click", () => {
                fetch(`http://localhost:3000/campaigns/${element.id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        isApproved: true
                    })
                })
                    .then(res => res.json())
                    .then(() => {
                        statusEl.textContent = "Accepted";
                        statusEl.style.backgroundColor = "green";

                        acceptBtn.style.display = "none";
                        rejectBtn.style.display = "inline-block";
                        banBtn.style.display = "inline-block";
                    });
            });

            banBtn.addEventListener("click", () => {
                fetch(`http://localhost:3000/campaigns/${element.id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        isApproved: false
                    })
                })
                    .then(res => res.json())
                    .then(() => {
                        statusEl.textContent = "Pending";
                        statusEl.style.backgroundColor = "red";

                        acceptBtn.style.display = "inline-block";
                        rejectBtn.style.display = "inline-block";
                        banBtn.style.display = "none";
                    });
            });

            rejectBtn.addEventListener("click", () => {
                fetch(`http://localhost:3000/campaigns/${element.id}`, {
                    method: "DELETE"
                })
                    .then(() => {
                        row.remove();
                        document.querySelector("#camp-num").textContent =
                            document.querySelectorAll("#camp-table tr").length;
                    });
            });

            row.querySelector(".view-btn").addEventListener("click", () => {
                d_title.value = element.title;
                d_goal.value = element.goal;
                d_deadline.value = element.deadline;
                d_description.value = element.description;

                dialog.showModal();
            });
            row.querySelector(".view-pledge-btn").addEventListener("click", () => {

    pledgesContainer.innerHTML = "";

    Promise.all([
        fetch("http://localhost:3000/pledges").then(res => res.json()),
        fetch("http://localhost:3000/users").then(res => res.json())
    ])
    .then(([pledges, users]) => {

        const filtered = pledges.filter(p => p.campaignId == element.id);

        if (filtered.length === 0) {
            pledgesContainer.innerHTML = "<p>No pledges</p>";
        }

        filtered.forEach(p => {
            const user = users.find(u => u.id == p.userId);

            let div = document.createElement("div");
            div.className = "pledge-item";

            div.innerHTML = `
                <span class="pledge-user">${user ? user.name : "Unknown"}</span>
                <span class="pledge-amount">$${p.amount}</span>
            `;

            pledgesContainer.appendChild(div);
        });

        pledgesDialog.showModal();
    });
});

        });
    });

closeBtn.addEventListener("click", () => {
    dialog.close();
});
closePledgesBtn.addEventListener("click", () => {
    pledgesDialog.close();
});