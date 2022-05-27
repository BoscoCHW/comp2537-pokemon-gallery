import { apiServerUrl } from "./helpers.js";
const userCards = document.querySelectorAll(".card");

// Handles the deletion of the given worryCard
const handleDelete = async (card) => {
  card.parentElement.removeChild(card);
  await fetch(`${apiServerUrl}user/remove/${card.id}`, {
    method: "DELETE",
  });
};

// Adds delete button functionalities for each worry card in the daily view page
userCards.forEach((userCard) => {
  userCard.addEventListener("click", (e) => {
    switch (e.target.className) {
      case "btn btn-primary confirmDeletion":
        // Closes the Bootstrap modal using JS
        const userCardModal = userCard.querySelector(".modal");
        userCardModal.addEventListener("hidden.bs.modal", () => {
          handleDelete(userCard);
        });
        break;
    }
  });
});

const modal = document.querySelector("#exampleModal");
modal.addEventListener("show.bs.modal", function (event) {
  // Button that triggered the modal
  const button = event.relatedTarget;
  if (button.id === "addUserBtn") return;
  // Extract info from data-bs-* attributes
  const userId = button.getAttribute("data-bs-userId");
  const firstname = button.getAttribute("data-bs-firstname");
  const lastname = button.getAttribute("data-bs-lastname");
  const email = button.getAttribute("data-bs-email");
  const password = button.getAttribute("data-bs-password");
  const isAdmin = button.getAttribute("data-bs-isAdmin") === "true";
  // console.log(userId, firstname, lastname, email, password, isAdmin);

  // Update the modal's content.
  const modalTitle = modal.querySelector(".modal-title");
  modalTitle.textContent = `Edit User ${firstname} ${lastname}`;
  const inputs = modal.querySelectorAll(".modal-body input");
  inputs.forEach((input) => {
    switch (input.id) {
      case "firstname":
        input.value = firstname;
        break;
      case "lastname":
        input.value = lastname;
        break;
      case "email":
        input.value = email;
        break;
      case "password":
        input.value = password;
        break;
      case "isAdmin":
        input.checked = isAdmin;
        break;
      case "userId":
        input.value = userId;
        break;
    }
  });
});

// add user
const userFormSubmitBtn = document.querySelector("#userFormSubmitBtn");
userFormSubmitBtn.addEventListener("click", async (e) => {
  const formData = new FormData(document.querySelector("#userForm"));
  const userId = formData.get("userId");
  console.log(userId);
  const body = new URLSearchParams(formData);
  let resp;
  if (userId) {
    resp = await fetch(`/api/user/update/${userId}`, { method: "PUT", body });
  } else {
    resp = await fetch("/api/user/create", { method: "POST", body });
  }
  if (resp.ok) {
    location.href = "/adminDashboard";
  } else {
    console.log(await resp.json());
  }
});
