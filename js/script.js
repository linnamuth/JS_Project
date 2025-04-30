const cart = [];

function addToCart(name, price, image) {
  cart.push({ name, price, image });
  updateCartCount();
  updateCartUI();

  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'success',
    title: `${name} added to cart!`,
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true
  });
}

function updateCartCount() {
  const countEl = document.getElementById('cartCount');
  if (countEl) countEl.innerText = cart.length;
}

function updateCartUI() {
  const cartItems = document.getElementById('cartItems');
  cartItems.innerHTML = '';

  if (cart.length === 0) {
    cartItems.innerHTML = '<li>No items in cart.</li>';
    return;
  }

  cart.forEach((item, index) => {
    const li = document.createElement('li');
    li.style.display = 'flex';
    li.style.alignItems = 'center';
    li.style.marginBottom = '10px';
    li.innerHTML = `
      <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px;">
      <div style="flex-grow: 1;">
        <div style="font-weight: bold;">${item.name}</div>
        <div style="color: gray;">${item.price}</div>
      </div>
      <button onclick="removeFromCart(${index})" style="border: none; background: transparent; color: red; font-size: 20px; cursor: pointer;">&times;</button>
    `;
    cartItems.appendChild(li);
  });
}
function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartCount();
  updateCartUI();
}
function checkout() {
  if (cart.length === 0) {
    Swal.fire({
      icon: 'info',
      title: 'Your cart is empty',
      showConfirmButton: false,
      timer: 1500
    });
    return;
  }
  const cartSummary = cart.map(item => `${item.name} - ${item.price}`).join('\n');
  const total = cart.reduce((sum, item) => sum + parseFloat(item.price.replace(/[^\d.]/g, '')), 0).toFixed(2);
  const qrData = `Cart:\n${cartSummary}\nTotal: $${total}`;
  // Show QR modal
  document.getElementById('qrModal').style.display = 'block';
  // Clear previous QR if any
  document.getElementById('qrcode').innerHTML = '';

  // Generate QR
  new QRCode(document.getElementById('qrcode'), {
    text: qrData,
    width: 200,
    height: 200
  });
  // Clear cart
  cart.length = 0;
  updateCartCount();
  updateCartUI();
  // Optionally hide cart list
  document.getElementById('cartList').style.display = 'none';
}
function closeQrModal() {
  const qrModal = document.getElementById('qrModal');
  qrModal.style.display = 'none';
}

document.querySelectorAll('.add-to-cart-btn').forEach(button => {
  button.addEventListener('click', function () {
    const card = this.closest('.card');
    const name = card.querySelector('.card-title').innerText;
    const price = card.querySelector('.card-text').innerText;
    const image = card.querySelector('img').src;
    addToCart(name, price, image);
  });
});

document.getElementById('cartIcon').addEventListener('click', function () {
  const cartList = document.getElementById('cartList');
  cartList.style.display = (cartList.style.display === 'none' || !cartList.style.display) ? 'block' : 'none';
});

function closeCart() {
  const cartList = document.getElementById('cartList');
  cartList.style.display = 'none';
}
function searchProducts() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
  const productCards = document.querySelectorAll('.product-card');

  productCards.forEach(card => {
    const title = card.querySelector('.card-title').textContent.toLowerCase();
    if (title.includes(searchTerm)) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}
