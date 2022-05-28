import { shuffle, postData } from "./helpers.js";

// game configs
let width, length, numOfPokemons;
let numOfCards;

// game logic variables
let firstCard = null;
let secondCard = null;
let pokemonCardsLocked = false;
let flippedCardNum = 0;
let won = false;

// pokemon image url
const pokemonImgUrl =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";

function flashMessage(message) {
  const messageDiv = document.querySelector(".message");
  messageDiv.textContent = message;
  setTimeout(() => {
    messageDiv.textContent = "";
  }, 1500);
}
function displayMessage(message) {
  const messageDiv = document.querySelector(".message");
  messageDiv.textContent = message;
  messageDiv.style.fontSize = "3rem";
}

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
    flashMessage("Width and length should multiply to an even number.");
    return;
  }

  if (numOfPokemons < 2 || numOfPokemons * 2 > width * length) {
    flashMessage("Invalid number of pokemons.");
    return;
  }

  gameConfigsDiv.parentElement.removeChild(gameConfigsDiv);

  const gameGrid = document.getElementById("game-grid");
  gameGrid.style.width = `${110 * length + 96}px`;

  numOfCards = width * length;
  const pokemonCards = [];

  const pokemonIds = [];
  for (let i = 0; i < numOfPokemons; i++)
    pokemonIds.push(Math.floor(Math.random() * 900) + 1);

  let pokemonId;
  for (let i = 0; i < numOfCards; i++) {
    if (i % 2 == 0) {
      const idx = (i / 2) % numOfPokemons;
      pokemonId = pokemonIds[idx];
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
  counter();
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
      if (flippedCardNum === numOfCards) won = true;
      if (won) {
        displayMessage("You won!");
        postData("/api/events", {
          text: `User won the pokemon memory game.`,
        });
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

function counter() {
  var totalTime = 1;
  var hrs = Math.floor(totalTime / 60);
  var min = totalTime % 60;

  var yourDateToGo = new Date();
  yourDateToGo.setMinutes(yourDateToGo.getMinutes() + min);
  yourDateToGo.setHours(yourDateToGo.getHours() + hrs);

  var timing = setInterval(function () {
    var currentDate = new Date().getTime();
    var timeLeft = yourDateToGo - currentDate;

    var hours = Math.floor(
      (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    if (hours < 10) hours = "0" + hours;
    var minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    if (minutes < 10) minutes = "0" + minutes;
    var seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    if (seconds < 10) seconds = "0" + seconds;

    document.querySelector(".timer").innerHTML =
      "Time left: " + minutes + "m " + seconds + "s";
    if (won) {
      clearInterval(timing);
    }
    if (timeLeft <= 0) {
      document.querySelector(".timer").innerHTML = "Time's Up!";
      clearInterval(timing);
      displayMessage("You lost");
      postData("/api/events", {
        text: `User lost the pokemon memory game.`,
      });
      document.querySelectorAll(".card").forEach((card) => {
        const newCard = card.cloneNode(true);
        card.parentNode.replaceChild(newCard, card);
      });
    }
  }, 1000);
}
