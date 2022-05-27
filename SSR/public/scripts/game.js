import { shuffle } from "./helpers.js";

// game configs
let width, length, numOfPokemons;
let numOfCards;

// game logic variables
let firstCard = null;
let secondCard = null;
let pokemonCardsLocked = false;
let flippedCardNum = 0;

// pokemon image url
const pokemonImgUrl =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";

const startBtn = document.querySelector("#start-btn");
startBtn.addEventListener("click", (e) => {
  const gameConfigsDiv = e.target.parentElement;
  const inputs = gameConfigsDiv.querySelectorAll("input");
  inputs.forEach((input) => {
    switch (input.id) {
      case "width":
        width = Number(input.value);
        break;
      case "length":
        length = Number(input.value);
        break;
      case "pokemonNums":
        numOfPokemons = Number(input.value);
    }
  });

  if ((width * length) % 2 !== 0) {
    const errorDiv = document.querySelector(".error-message");
    errorDiv.textContent =
      "Width and length should multiply to an even number.";
    setTimeout(() => {
      errorDiv.textContent = "";
    }, 1000);
    return;
  }

  if (numOfPokemons < 2 || numOfPokemons * 2 > width * length) {
    const errorDiv = document.querySelector(".error-message");
    errorDiv.textContent = "Invalid number of pokemons.";
    setTimeout(() => {
      errorDiv.textContent = "";
    }, 1000);
    return;
  }
  
  gameConfigsDiv.parentElement.removeChild(gameConfigsDiv);
  
  const gameGrid = document.getElementById("game-grid");
  gameGrid.style.width = `${110 * length + 96}px`

  numOfCards = width * length;
  const pokemonCards = [];

  let pokemonId;
  for (let i = 0; i < numOfCards; i++) {
    if (i % 2 == 0) {
      pokemonId = Math.floor(Math.random() * 900) + 1;
    }
    const pokemonCard = document.createElement("div");
    pokemonCard.classList.add("card");
    pokemonCard.id = `card-${i}`;
    pokemonCard.innerHTML = `
        <img class="front_face" src="${pokemonImgUrl}${pokemonId}.png" alt="" />
        <img class="back_face" src="/img/pokeball.png" alt="" />
    `;
    pokemonCards.push(pokemonCard);
  }

  const shuffledCards = shuffle(pokemonCards);

  shuffledCards.forEach((card) => {
    card.addEventListener("click", handleCardClick);
    gameGrid.appendChild(card);
  });
});

function handleCardClick(event) {
  if (pokemonCardsLocked) return;

  if (!firstCard) {
    // the first card
    firstCard = event.currentTarget;
    firstCard.classList.toggle("flip");
  } else {
    // this is the 2nd card
    secondCard = event.currentTarget;
    // if the second card is the same as the first card, do nothing
    if (firstCard.id === secondCard.id) {
      secondCard = null;
      return;
    }
    // 2nd card is not the same, flip the card
    secondCard.classList.toggle("flip");
    // check if we have match!
    const firstCardPokemonSrc = firstCard.querySelector(".front_face").src;
    const secondCardPokemonSrc = secondCard.querySelector(".front_face").src;

    if (firstCardPokemonSrc === secondCardPokemonSrc) {
      console.log("a match!");
      // update the game state
      // disable clicking events on these cards
      firstCard.removeEventListener("click", handleCardClick);
      secondCard.removeEventListener("click", handleCardClick);
      firstCard = null;
      secondCard = null;
      flippedCardNum += 2;
      if (flippedCardNum == 16) {
        console.log("you won!");
      }
    } else {
      console.log("not a match");
      pokemonCardsLocked = true;
      // unflipping
      setTimeout(() => {
        firstCard.classList.toggle("flip");
        secondCard.classList.toggle("flip");
        firstCard = null;
        secondCard = null;
        pokemonCardsLocked = false;
      }, 1000);
    }
  }
}
