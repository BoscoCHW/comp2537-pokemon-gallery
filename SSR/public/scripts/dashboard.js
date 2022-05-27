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
      case "deleteUser btn secondary-primary":

        // Closes the Bootstrap modal using JS
        let userCardModal = userCard.querySelector(".modal");
        // let userCardModalComponent = new bootstrap.Modal(userCardModal);

        userCardModal.addEventListener('hidden.bs.modal', () => {
          handleDelete(userCard);
        });
        // userCardModalComponent.hide();
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