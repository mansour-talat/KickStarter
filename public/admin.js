const table = document.getElementById("table")
const logout = document.getElementById("logout")

const usersclick=document.querySelector(".user")
const campsclick=document.querySelector(".camps")
const pledgesclick=document.querySelector(".pledges")
const usersec=document.querySelector("#users")
const campsec=document.querySelector("#camps")
const pledgesec=document.querySelector("#pledges")
usersclick.addEventListener("click",()=>{
    campsec.style.display = "none"
    usersec.style.display="block"

})
campsclick.addEventListener("click",()=>{
    campsec.style.display = "block"
    usersec.style.display="none"

})

let user=JSON.parse(localStorage.getItem("user"))
logout.addEventListener("click",()=>{
    localStorage.removeItem("user")
    window.location.href="login.html"


})


fetch("http://localhost:3000/users")
.then(res => res.json())
.then(users => {
    document.getElementById("usernum").innerHTML=users.length-1
    table.innerHTML = ""

    users.forEach(user => {
        let stat = user.isActive ? "Active" : "Banned"
        let color = user.isActive ? "green" : "red"
        let acolor = user.isActive ? "red" : "green"

        let actionText = user.isActive ? "Ban" : "Unban"
        if(user.role==="admin"){
            return;
        }
        let row = document.createElement("tr")

        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td style="color:white;"><span style="background-color:${color}" id="status">${stat}</span></td>
            <td class="action"  data-id="${user.id}" style="cursor:pointer;  color:white">
               <span id="status"style="background-color:${acolor};"> ${actionText}</span>
            </td>
        `

        row.querySelector(".action").addEventListener("click", () => {

            fetch(`http://localhost:3000/users/${user.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    isActive: !user.isActive
                })
            })
            .then(res => res.json())
            .then(() => {location.reload()
        })
        })

        table.appendChild(row)
    })
})