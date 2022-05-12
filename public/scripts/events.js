import { apiServerUrl } from "./helpers.js";

const eventWrappers = document.querySelectorAll(".event-wrapper");

const handleDelete = async (eventWrapper) => {
  eventWrapper.parentElement.removeChild(eventWrapper);
  const resp = await fetch(`${apiServerUrl}events/${eventWrapper.id}`, {
    method: "DELETE",
  });
  console.log(await resp.json());
};

const handleUpVote = (eventWrapper) => {
  
};

const handleDownVote = (eventWrapper) => {};

eventWrappers.forEach((eventWrapper) => {
  eventWrapper.addEventListener("click", (e) => {
    console.log(e.target.className);
    switch (e.target.className) {
      case "delete-btn":
        handleDelete(eventWrapper);
        break;
      case "up-vote":
        handleUpVote(eventWrapper)
        break;

      case "down-vote":
        break;
    }
  });
});
