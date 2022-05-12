import {
  getPokemon,
  handleHomePageBtnClick,
  handleSearchPageBtnClick,
  makePokemonCard,
} from "./helpers.js";

window.addEventListener("load", async () => {
  // when the window is loaded, show 9 random pokemons

  const pokemons_number = 9;
  const galleryWrapper = document.getElementById("gallery-wrapper");
  const pokemonList = [];

  for (let i = 0; i < pokemons_number; i++) {
    let pokemonId = Math.floor(Math.random() * 900) + 1;
    let pokemon = await getPokemon(pokemonId);
    while (!pokemon) {
      pokemonId = Math.floor(Math.random() * 900) + 1;
      pokemon = await getPokemon(pokemonId);
    }
    pokemonList.push(pokemon);
  }

  pokemonList.forEach((pokemon) => {
    const pokemonCard = makePokemonCard(pokemon);

    galleryWrapper.appendChild(pokemonCard);
  });

  const homePageBtn = document.querySelector("#homePageBtn");
  homePageBtn.addEventListener("click", handleHomePageBtnClick);

  const searchPageBtn = document.querySelector("#searchPageBtn");
  searchPageBtn.addEventListener("click", handleSearchPageBtnClick);
});
