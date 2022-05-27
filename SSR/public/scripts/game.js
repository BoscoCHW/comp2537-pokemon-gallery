import { shuffle } from "./helpers.js";

const pokemonImgUrl =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";

window.addEventListener("load", (e) => {
  const numOfPokemons = 8;
  const gameGrid = document.getElementById("game-grid");
  const pokemonCards = [];

  let pokemonId;
  for (let i = 0; i < numOfPokemons * 2; i++) {
    if (i % 2 == 0) {
      pokemonId = Math.floor(Math.random() * 900) + 1;
    }
    const pokemonCard = document.createElement("div");
    pokemonCard.classList.add("card");
    pokemonCard.id = `card-${i}`;
    pokemonCard.innerHTML = `
        <img id="img${i}" class="front_face" src="${pokemonImgUrl}${pokemonId}.png" alt="" />
        <img class="back_face" src="/img/pokeball.png" alt="" />
    `;
    pokemonCards.push(pokemonCard);
  }

  const shuffledCards = shuffle(pokemonCards);

  shuffledCards.forEach((card) => gameGrid.appendChild(card));

  setup();
});

let firstCard = undefined;
let secondCard = undefined;

let firstCardHasBeenFlipped = false;
let pokemonCardsLocked = false;

function setup() {
  $(".card").on("click", function () {
    if (pokemonCardsLocked) return;

    $(this).toggleClass("flip");

    if (!firstCardHasBeenFlipped) {
      // the first card
      firstCard = $(this).find(".front_face")[0];
      // console.log(firstCard);
      firstCardHasBeenFlipped = true;
    } else {
      // this is the 2nd card
      secondCard = $(this).find(".front_face")[0];

      console.log(firstCard, secondCard);
      // ccheck if we have match!
      if (
        firstCard.id !== secondCard.id &&
        $(`#${firstCard.id}`).attr("src") == $(`#${secondCard.id}`).attr("src")
      ) {
        console.log("a match!");
        // update the game state
        // disable clicking events on these cards
        $(`#${firstCard.id}`).parent().off("click");
        $(`#${secondCard.id}`).parent().off("click");
      } else {
        console.log("not a match");
        pokemonCardsLocked = true;
        // unflipping
        setTimeout(() => {
          $(`#${firstCard.id}`).parent().removeClass("flip");
          $(`#${secondCard.id}`).parent().removeClass("flip");
          firstCardHasBeenFlipped = false;
          pokemonCardsLocked = false;
        }, 1000);
      }
    }
  });
}
