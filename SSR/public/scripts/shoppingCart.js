import { apiServerUrl } from "./helpers.js";

const makeCartItem = (cartItem) => {
  const cartItemWrapper = document.createElement("tr");
  cartItemWrapper.classList.add("cart-item-wrapper");
  cartItemWrapper.innerHTML = `
    <td class="text-left"> <div class="product-wrapper"> ${
      cartItem.pokemonId
    } </div> </td>
    <td class="text-center"> <div class="quantity-wrapper"> <button class="decrement"> - </button> <div> ${
      cartItem.quantity
    } </div> <button class="increment"> + </button> </div> </td>
    <td class="text-right"> <div class="sub-total-wrapper"> $${
      cartItem.quantity * cartItem.price
    } </div> </td>
  `;
  
  const quantityWrapper = cartItemWrapper.querySelector(".quantity-wrapper");
  quantityWrapper.addEventListener("click", async (e) => {
    switch (e.target.className) {
      case "increment":
        break;

      case "decrement":
        break;
    }
  })


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

const init = async () => {
  const shoppingCartWrapper = document.querySelector("#shopping-cart-wrapper");
  const resp = await fetch(`${apiServerUrl}getShoppingCartItems`);
  const shoppingCartItems = await resp.json();

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

    const shoppingCartTableBody = document.createElement("tbody");

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
    shoppingCartTable.appendChild(shoppingCartTableBody);
    shoppingCartWrapper.appendChild(shoppingCartTable);

    addCheckoutBtn(shoppingCartWrapper);
  }
};

window.addEventListener("load", () => {
  // when the window is loaded, show pokemons
  init();
});
