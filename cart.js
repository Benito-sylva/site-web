// Sélectionnez les éléments HTML nécessaires
const menuItems = document.querySelectorAll('.menu-item');
const cartTable = document.querySelector('.cart table tbody');
const totalPriceElement = document.getElementById('total-price');
const checkoutBtn = document.querySelector('.cart .checkout-btn');

// Tableau pour stocker les éléments du panier
let cartItems = [];

// Fonction pour ajouter un plat au panier
function addToCart(item) {
  // Vérifier si le plat est déjà dans le panier
  const existingItem = cartItems.find(i => i.name === item.name);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cartItems.push({
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image
    });
  }

  updateCart();
  saveCart();
}

// Fonction pour mettre à jour l'affichage du panier
function updateCart() {
  cartTable.innerHTML = '';
  let total = 0;

  cartItems.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="item-name">${item.name}</td>
      <td>
        <input type="number" class="quantity-input" value="${item.quantity}" min="1" onchange="updateItemQuantity('${item.name}', this.value)">
      </td>
      <td class="item-price">${item.price} Fr</td>
      <td class="item-total">${(item.price * item.quantity).toFixed(0)} Fr</td>
      <td><span class="remove-item" onclick="removeFromCart('${item.name}')">Supprimer</span></td>
    `;
    cartTable.appendChild(row);
    total += item.price * item.quantity;
  });

  totalPriceElement.textContent = `${total.toFixed(0)} Fr`;
}

// Fonction pour mettre à jour la quantité d'un plat dans le panier
function updateItemQuantity(itemName, newQuantity) {
  const item = cartItems.find(i => i.name === itemName);
  item.quantity = parseInt(newQuantity);
  updateCart();
  saveCart();
}

// Fonction pour supprimer un plat du panier
function removeFromCart(itemName) {
  cartItems = cartItems.filter(i => i.name !== itemName);
  updateCart();
  saveCart();
}

// Fonction pour enregistrer le panier dans le stockage local
function saveCart() {
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

// Fonction pour charger le panier depuis le stockage local
function loadCart() {
  const savedCart = localStorage.getItem('cartItems');
  if (savedCart) {
    cartItems = JSON.parse(savedCart);
    updateCart();
  }
}

// Ajouter un écouteur d'événement sur les boutons "Ajouter au panier"
menuItems.forEach(item => {
  const addToCartBtn = item.querySelector('.add-to-cart');
  addToCartBtn.addEventListener('click', () => {
    const itemData = {
      name: item.querySelector('h3').textContent,
      price: parseFloat(item.querySelector('.price').textContent),
      image: item.querySelector('img').src
    };
    addToCart(itemData);
  });
});

// Charger le panier depuis le stockage local au chargement de la page
loadCart();

// Ajouter un écouteur d'événement sur le bouton "Passer la commande"
checkoutBtn.addEventListener('click', () => {
  // Vérifier que le panier n'est pas vide
  if (cartItems.length === 0) {
    alert('Votre panier est vide. Veuillez ajouter des plats avant de passer une commande.');
    return;
  }

  // Envoyer les données de la commande au serveur ou afficher une page de confirmation
  alert('Votre commande a été passée avec succès !');
  cartItems = [];
  updateCart();
  saveCart();
});