let current_user = JSON.parse(localStorage.getItem("user"));
let userId = current_user.id;

const cont = document.getElementById("cont");
const dialog = document.getElementById("deleteDialog");
const confirmBtn = document.getElementById("confirmDelete");
const cancelBtn = document.getElementById("cancelDelete");

const updatedialog = document.getElementById("updatedDialog");
const form = updatedialog.querySelector("form");
const updateclose = document.querySelector(".actions-close");

const titleInput = document.getElementById("title");
const deadlineInput = document.getElementById("deadline");
const goalInput = document.getElementById("goal");
const descInput = document.getElementById("desc");
const bannerInput = document.getElementById("banner");

let selectedId = null;

fetch(`http://localhost:3000/campaigns?creatorId=${userId}`)
    .then((res) => res.json())
    .then((camp) => {
        camp.forEach(ele => {
            let stat = "";
            let color = "#10B76F";

            if (ele.isApproved == true) {
                stat = "Approved";
            } else {
                stat = "Pending";
                color = "orange";
            }

            cont.innerHTML += `
            <div class="camp-row">
                <div class="left">
                    <img class="camp-img" src="${ele.img}" alt="">
                    <div class="stats">
                        <span>${ele.title}</span>
                        <span class="status" style="background-color:${color};">${stat}</span>
                    </div>
                </div>
                <div class="actions">
                    <button class="update">Update</button>
                    <button class="delete" data-id="${ele.id}">Delete</button>
                </div>
            </div>
            `;
        });
    });

cont.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete")) {
        selectedId = e.target.dataset.id;
        dialog.showModal();
    }
});

cancelBtn.addEventListener("click", () => {
    dialog.close();
    selectedId = null;
});

confirmBtn.addEventListener("click", () => {
    fetch(`http://localhost:3000/campaigns/${selectedId}`, {
        method: "DELETE"
    })
        .then(() => {
            const btn = document.querySelector(`[data-id="${selectedId}"]`);
            if (btn) btn.closest(".camp-row").remove();
            dialog.close();
            selectedId = null;
        });
});

cont.addEventListener("click", (e) => {
    if (e.target.classList.contains("update")) {
        const row = e.target.closest(".camp-row");
        const id = row.querySelector(".delete").dataset.id;
        selectedId = id;

        fetch(`http://localhost:3000/campaigns/${selectedId}`)
            .then(res => res.json())
            .then(data => {
                titleInput.value = data.title;
                deadlineInput.value = data.deadline;
                goalInput.value = data.goal;
                descInput.value = data.description;
            });

        updatedialog.showModal();
        
    }
});

updateclose.addEventListener("click", (e) => {
    e.preventDefault();
    updatedialog.close();
});

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
    const file = bannerInput.files[0];

    let imgData = "";
    if (file) {
        imgData = await fileToBase64(file);
    }

    fetch(`http://localhost:3000/campaigns/${selectedId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: titleInput.value,
            goal: Number(goalInput.value),
            deadline: deadlineInput.value,
            description: descInput.value,
            isApproved:false,
             img: imgData
        })
    })
        .then(res => res.json())
        .then(() => {
            alert("Campaign updated");
            updatedialog.close();
            location.reload();
        });
});