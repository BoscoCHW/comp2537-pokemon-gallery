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

// Adds edit button functionalities for each worry card in the daily view page
document.querySelectorAll(".editBtn").forEach((editBtn) => {
  editBtn.addEventListener("click", () => {
    window.location.href = `/editWorryEntry/${editBtn.id}`;
  });
});

const userFormSubmitBtn = document.querySelector("#userFormSubmitBtn");
userFormSubmitBtn.addEventListener("click", async (e) => {
  const body = new URLSearchParams(
    new FormData(document.querySelector("#userForm"))
  );

  const resp = await fetch("/api/user/create", { method: "POST", body });
  if (resp.ok) {
    location.href = "/adminDashboard";
  } else {
    console.log(await resp.json());
  }
});
