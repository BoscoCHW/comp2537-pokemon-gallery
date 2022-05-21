import { apiServerUrl } from "./helpers.js";

var shoppingCartItems;

async function handleQuantityChange(type, cartItemId) {
  const resp = await fetch(
    `${apiServerUrl}shopItem/${type}Quantity/${cartItemId}`
  );
  const updatedShopItem = await resp.json();
  const oldShopItem = shoppingCartItems.find(
    (item) => item._id === updatedShopItem._id
  );
  oldShopItem.quantity = updatedShopItem.quantity;

  if (updatedShopItem.quantity == 0) {
    shoppingCartItems = shoppingCartItems.filter(
      (item) => item._id !== updatedShopItem._id
    );
  }
  const shoppingCart = document.querySelector("#shopping-cart");
  shoppingCart.removeChild(shoppingCart.querySelector("#shopping-cart-body"));
  shoppingCart.appendChild(createShoppingCartTableBody());
}

const makeCartItem = (cartItem) => {
  const cartItemWrapper = document.createElement("tr");
  cartItemWrapper.classList.add("cart-item-wrapper");
  cartItemWrapper.id = cartItem._id;
  cartItemWrapper.innerHTML = `
    <td class="text-left"> 
      <div class="product-wrapper"> 
      <div class="pokemon-id"> #${cartItem.pokemonId} </div>
      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${cartItem.pokemonId}.png" />   
      </div> 
    </td>
    <td class="text-center"> <div class="quantity-wrapper"> <button class="decrement"> - </button> <div> ${
      cartItem.quantity
    } </div> <button class="increment"> + </button> </div> </td>
    <td class="text-right"> <div class="sub-total-wrapper"> $${
      cartItem.quantity * cartItem.price
    } </div> </td>
  `;

  const quantityWrapper = cartItemWrapper.querySelector(".quantity-wrapper");
  quantityWrapper.addEventListener("click", async (e) =>
    handleQuantityChange(e.target.className, cartItem._id)
  );

  return cartItemWrapper;
};

function addCheckoutBtn(shoppingCartWrapper) {
  const checkoutBtnWrapper = document.createElement("div");
  checkoutBtnWrapper.id = "checkout-btn-wrapper";
  checkoutBtnWrapper.innerHTML = `<button id="checkout-btn"> Checkout </button>`;

  const checkoutBtn = checkoutBtnWrapper.querySelector("#checkout-btn");
  checkoutBtn.addEventListener("click", async (e) => {
    const resp = await fetch(`${apiServerUrl}checkout`);
    const data = await resp.json();
    console.log(data);
    location.reload();
  });
  shoppingCartWrapper.appendChild(checkoutBtnWrapper);
}

function createShoppingCartTableBody() {
  const shoppingCartTableBody = document.createElement("tbody");
  shoppingCartTableBody.id = "shopping-cart-body";
  shoppingCartItems.forEach((cartItem) => {
    shoppingCartTableBody.appendChild(makeCartItem(cartItem));
  });

  const total = shoppingCartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const summaryRow = document.createElement("tr");
  summaryRow.innerHTML = `
    <td class="text-left"> </td>
    <td class="text-right"> Total: </td>
    <td class="text-right"> <div id="total-price"> $${total} </div> </td>
  `;
  shoppingCartTableBody.appendChild(summaryRow);
  return shoppingCartTableBody;
}

const init = async () => {
  const shoppingCartWrapper = document.querySelector("#shopping-cart-wrapper");
  const resp = await fetch(`${apiServerUrl}getShoppingCartItems`);
  shoppingCartItems = await resp.json();

  if (shoppingCartItems.length == 0) {
    const emptyMessage = document.createElement("div");
    emptyMessage.id = "empty-cart-message";
    emptyMessage.innerText = "Your shopping cart is empty!";
    shoppingCartWrapper.appendChild(emptyMessage);
  } else {
    const shoppingCartTable = document.createElement("table");
    shoppingCartTable.id = "shopping-cart";
    const shoppingCartTableHeader = document.createElement("thead");
    shoppingCartTableHeader.innerHTML = `<tr> <th class="text-left"> Product </th> <th class="text-center"> Quantity </th> <th class="text-right"> Sub-Totals </th> </tr>`;
    shoppingCartTable.appendChild(shoppingCartTableHeader);

    shoppingCartTable.appendChild(createShoppingCartTableBody());
    shoppingCartWrapper.appendChild(shoppingCartTable);

    addCheckoutBtn(shoppingCartWrapper);
  }
};

window.addEventListener("load", () => {
  // when the window is loaded, show pokemons
  init();
});
