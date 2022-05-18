export const colorMap = {
  fire: "#FDDFDF",
  grass: "#DEFDE0",
  electric: "#FCF7DE",
  water: "#DEF3FD",
  ground: "#f4e7da",
  rock: "#d5d5d4",
  fairy: "#fceaff",
  poison: "#98d7a5",
  bug: "#f8d5a3",
  dragon: "#97b3e6",
  psychic: "#eceda1",
  flying: "#F5F5F5",
  fighting: "#E6E0D4",
  normal: "#F5F5F5",
};

export const pokeapiUrl = "https://pokeapi.co/api/v2/";
export const apiServerUrl = "http://localhost:5000/api/";

export const getPokemon = async (id) => {
  const url = `${pokeapiUrl}pokemon/${id}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const pokemon = await res.json();
  return pokemon;
};

export const makePokemonCard = (pokemon) => {
  const pokemonCard = document.createElement("div");
  pokemonCard.classList.add("pokemon-card");

  const poke_types = pokemon.types.map((type) => type.type.name);
  const displayType = Object.keys(colorMap).find((type) =>
    poke_types.includes(type)
  );
  const color = colorMap[displayType];
  const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);

  pokemonCard.style.backgroundColor = color;

  const pokemonCardContent = `
    <h3>#${pokemon.id}</h4>
    <div class="img-container"> 
      <img src="${pokemon.sprites.other["official-artwork"].front_default}" />
    </div>
    <h1>${name}</h2>
  `;

  pokemonCard.innerHTML = pokemonCardContent;

  pokemonCard.addEventListener("click", (e) => {
    window.location.assign(`./profile/${pokemon.id}`);
    const data = {
      text: `User visited pokemon profile ${pokemon.id} - ${name}`,
    };
    postData(`${apiServerUrl}events`, data);
  });
  return pokemonCard;
};

export async function postData(url = "", data = {}) {

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

export const handleHomePageBtnClick = async (e) => {
  e.preventDefault();
  const data = {
    text: `User visited home page.`,
  };
  const url = `${apiServerUrl}events`;
  const result = await postData(url, data);
  console.log(result);
  window.location.assign("/");
};

export const handleSearchPageBtnClick = async (e) => {
  e.preventDefault();
  const data = {
    text: `User visited search page.`,
  };
  const url = `${apiServerUrl}events`;
  const result = await postData(url, data);
  console.log(result);
  window.location.assign("/search");
};
