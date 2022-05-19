import {
  handleAddToCartForPokemon,
} from "./helpers.js";

const addToCartBtn = document.querySelector(".add-to-cart-btn");
const pokemonId = addToCartBtn.id.split("-")[1];
addToCartBtn.addEventListener("click", e => handleAddToCartForPokemon(e, pokemonId));