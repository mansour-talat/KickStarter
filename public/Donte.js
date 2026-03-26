const cont = document.getElementById("containerr");

function loadPledges() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    cont.innerHTML = "User not logged in.";
    return;
  }

  fetch(`http://localhost:3000/pledges?userId=${user.id}`)
    .then(res => res.json())
    .then(pledges => {
      return fetch(`http://localhost:3000/campaigns`)
        .then(res => res.json())
        .then(campaigns => {
          const html = pledges
            .map(p => {
              const cam = campaigns.find(c => c.id === p.campaignId);
              return `
                <div class="row">
                  <div>
                    <img class="img" src="${cam.img}" alt="${cam.title}">
                    <span class="title">${cam.title}</span>
                  </div>
                  <span>${p.amount}$</span>
                </div>
              `;
            })
            .join("");

          cont.innerHTML = html ;
        });
    })
    .catch(err => {
      console.error("Failed to load pledges:", err);
    });
}

loadPledges();