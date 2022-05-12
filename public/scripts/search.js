import { pokeapiUrl, getPokemon, makePokemonCard } from "./helpers.js";

const regionIdMap = {
  Kanto: {
    start: 1,
    end: 151,
  },
  Johto: {
    start: 152,
    end: 251,
  },
  Hoenn: {
    start: 252,
    end: 386,
  },
  Sinnoh: {
    start: 387,
    end: 494,
  },
  Unova: {
    start: 495,
    end: 649,
  },
  Kalos: {
    start: 650,
    end: 721,
  },
  Alola: {
    start: 722,
    end: 809,
  },
  Galar: {
    start: 810,
    end: 898,
  },
};

const galleryWrapper = document.querySelector("#gallery-wrapper");
const searchSubmitBtn = document.querySelector("#search-form-btn");
const regionSelector = document.querySelector("#region-selector");
const typeSelector = document.querySelector("#type-selector");
const nameQuery = document.querySelector("#name");
const prevBtn = document.querySelector("#prev");
const nextBtn = document.querySelector("#next");

let pokemonList = [];
const numOfPokemonToDisplay = 9;
let page = 1;

const getIdFromUrl = (url) => Number(url.split("/")[6]);

const filterByRegionAndName = (pokemon, region, queryName) => {
  const { start, end } = regionIdMap[region];
  const pokemonId = getIdFromUrl(pokemon.url);
  return (
    pokemonId >= start && pokemonId <= end && pokemon.name.includes(queryName)
  );
};

const showPokemons = () => {
  const pokemonListToShow = pokemonList.slice(
    (page - 1) * numOfPokemonToDisplay,
    page * numOfPokemonToDisplay
  );
  pokemonListToShow.forEach((pokemon) => {
    const pokemonCard = makePokemonCard(pokemon);
    galleryWrapper.appendChild(pokemonCard);
  });
};

const getPokemonOfTypeRegionName = async (type, region, name) => {
  let queryUrl;
  let data;
  if (type === "all-types") {
    queryUrl = `${pokeapiUrl}pokemon/?limit=1126`;
    const response = await fetch(queryUrl);
    const rawData = await response.json();
    data = rawData.results;
  } else {
    queryUrl = `${pokeapiUrl}type/${type}`;
    const response = await fetch(queryUrl);
    const rawData = await response.json();
    data = rawData.pokemon.map((pokemonObj) => {
      const {
        pokemon: { name, url },
      } = pokemonObj;
      return { name, url };
    });
  }

  const pokemonObjs = data.filter((pokemonObj) =>
    filterByRegionAndName(pokemonObj, region, name)
  );
  pokemonList = await Promise.all(
    pokemonObjs.map(async (pokemonObj) => {
      const id = getIdFromUrl(pokemonObj.url);
      const pokemon = await getPokemon(id);
      return pokemon;
    })
  );
};

async function handleSearch(e) {
  e.preventDefault();
  pokemonList = [];
  galleryWrapper.innerHTML = "";
  const region = regionSelector.value;
  const type = typeSelector.value;
  const name = nameQuery.value.toLowerCase();
  await getPokemonOfTypeRegionName(type, region, name);
  page = 1;
  prevBtn.style.display = "none";
  if (page * numOfPokemonToDisplay < pokemonList.length) {
    nextBtn.style.display = "inline-block";
  } else {
    nextBtn.style.display = "none";
  }
  showPokemons();
}

const handlePrev = (e) => {
  page -= 1;
  galleryWrapper.innerHTML = "";
  showPokemons();
  nextBtn.style.display = "inline-block";
  if (page <= 1) {
    // hide button
    e.currentTarget.style.display = "none";
  }
};

const handleNext = (e) => {
  page += 1;
  galleryWrapper.innerHTML = "";
  showPokemons();
  prevBtn.style.display = "inline-block";
  if (page * numOfPokemonToDisplay >= pokemonList.length) {
    // hide button
    e.currentTarget.style.display = "none";
  }
};
const init = async () => {
  prevBtn.style.display = "none";
  prevBtn.addEventListener("click", handlePrev);
  nextBtn.addEventListener("click", handleNext);
  searchSubmitBtn.addEventListener("click", handleSearch);

  await getPokemonOfTypeRegionName("all-types", "Kanto", "");
  showPokemons();
};

window.addEventListener("load", () => {
  // when the window is loaded, show pokemons
  init();
});
