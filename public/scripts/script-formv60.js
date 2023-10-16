function removeCartItem(event) {
	let buttonClicked = event.target;
	buttonClicked.parentElement.remove();
	updatetotal();
	saveCartToStorage();
}

function quantityChanged(event) {
	let input = event.target;
	if (isNaN(input.value) || input.value <= 0) {
		input.value = 1;
	}
	updatetotal();
	saveCartToStorage();
}

function addToCart(name, price, picture) {
	const sizeRadios = document.getElementsByName('size');
	let selectedSize = null;
	let selectedPrice = null;
	for (const radio of sizeRadios) {
		if (radio.checked) {
			selectedPrice = radio.value;
			if (
				selectedPrice == '1Np7RHKFt6b6LPuXHfcjQI6s' ||
				selectedPrice == '1Np7SIKFt6b6LPuX9JzHeCAv' ||
				selectedPrice == '1Np7TFKFt6b6LPuXS5X5CX2O'
			) {
				selectedSize = 'M';
			} else if (
				selectedPrice == '1Np7RUKFt6b6LPuXnwCr3COz' ||
				selectedPrice == '1Np7SWKFt6b6LPuXzWHuj3mk' ||
				selectedPrice == '1Np7TUKFt6b6LPuXY7lMdoRv'
			) {
				selectedSize = 'L';
			} else if (
				selectedPrice == '1Np7RlKFt6b6LPuXbVwa9n7v' ||
				selectedPrice == '1Np7SpKFt6b6LPuXsGXCV72u' ||
				selectedPrice == '1Np7ThKFt6b6LPuX21q7GV7z'
			) {
				selectedSize = 'XL';
			}

			break;
		}
	}

	if (selectedSize === null) {
		displayNotification('Aby dodać produkt do koszyka musisz wybrać rozmiar (M/L/XL)');
		return;
	}

	// Check if the product is already in the cart with the same name and size
	let cartItems = document.querySelectorAll('.cart-box');
	for (let i = 0; i < cartItems.length; i++) {
		let item = cartItems[i];
		let itemName = item.getAttribute('data-name');
		let itemSize = item.getAttribute('data-size');

		if (itemName === name && itemSize === selectedSize) {
			// Zwiększ ilość produktu o 1
			let quantityInput = item.querySelector('.cart-quantity');
			let currentQuantity = parseInt(quantityInput.value);
			quantityInput.value = currentQuantity + 1;

			displayNotification('Produkt dodany do koszyka.');
			updatetotal();
			saveCartToStorage();
			return;
		}
	}

	function displayNotification(message) {
		const notificationElement = document.getElementById('notification');
		notificationElement.textContent = message;
		notificationElement.style.display = 'block';

		// Schowaj powiadomienie po pewnym czasie (np. 3 sekundy)
		setTimeout(() => {
			notificationElement.style.display = 'none';
		}, 3000); // 3000 milisekund (3 sekundy)
	}

	// Create a new cart item
	let cartContent = document.querySelector('.cart-content');
	let newItem = document.createElement('div');
	newItem.setAttribute('data-name', name);
	newItem.setAttribute('data-size', selectedSize);
	newItem.className = 'cart-box';
	newItem.innerHTML = `
      <img src="${picture}" class="cart-img" />
      <div class="detail-box">
          <div class="cart-products-title">${name} - ${selectedSize}</div>
          <div class="cart-price">${price} zł</div>
          <div hidden class="price-id" >${selectedPrice}</div>
          <input type="number" value="1" class="cart-quantity" />
      </div>
      <img src="images/trash.png" class="cart-remove" />`;

	let removeButton = newItem.querySelector('.cart-remove');
	removeButton.addEventListener('click', removeCartItem);

	let quantityInput = newItem.querySelector('.cart-quantity');
	quantityInput.addEventListener('change', quantityChanged);

	cartContent.appendChild(newItem);

	updatetotal();
	saveCartToStorage();
	displayNotification('Produkt dodany do koszyka.');
}

function updatetotal() {
	let cartBoxes = document.getElementsByClassName('cart-box');
	let total = 17;

	for (let i = 0; i < cartBoxes.length; i++) {
		let cartBox = cartBoxes[i];
		let priceElement = cartBox.getElementsByClassName('cart-price')[0];
		let quantityElement = cartBox.getElementsByClassName('cart-quantity')[0];
		let price = parseFloat(priceElement.innerText);
		let quantity = quantityElement.value;
		total += price * quantity;
	}

	total = Math.round(total * 100) / 100;
	document.getElementsByClassName('total-price')[0].innerText = total + 'zł';
	localStorage.setItem('cartTotal', total);
}

function loadCartFromStorage() {
	let cartContent = document.querySelector('.cart-content');
	cartContent.innerHTML = localStorage.getItem('cartItems') || '';

	let removeButtons = document.getElementsByClassName('cart-remove');
	for (let i = 0; i < removeButtons.length; i++) {
		removeButtons[i].addEventListener('click', removeCartItem);
	}

	let quantityInputs = document.getElementsByClassName('cart-quantity');
	for (let i = 0; i < quantityInputs.length; i++) {
		quantityInputs[i].addEventListener('change', quantityChanged);
	}

	for (let i = 0; i < quantityInputs.length; i++) {
		let item = quantityInputs[i].parentNode.parentNode;
		let itemName = item.getAttribute('data-name');
		let savedQuantity = localStorage.getItem('cartQuantity_' + itemName);
		if (savedQuantity) {
			quantityInputs[i].value = savedQuantity;
		}
	}

	let storedTotal = localStorage.getItem('cartTotal');
	if (storedTotal) {
		document.getElementsByClassName('total-price')[0].innerText = storedTotal + 'zł';
	}
}

function saveCartToStorage() {
	let cartContent = document.querySelector('.cart-content');
	let cartItems = cartContent.innerHTML;
	localStorage.setItem('cartItems', cartItems);

	let quantityInputs = document.getElementsByClassName('cart-quantity');
	for (let i = 0; i < quantityInputs.length; i++) {
		let item = quantityInputs[i].parentNode.parentNode;
		let itemName = item.getAttribute('data-name');
		let quantity = quantityInputs[i].value;
		localStorage.setItem('cartQuantity_' + itemName, quantity);
	}
}

document.addEventListener('DOMContentLoaded', () => {
	loadCartFromStorage();
});

function getCartProducts() {
	let cartBoxes = document.getElementsByClassName('cart-box');
	let cartProducts = [];

	for (let i = 0; i < cartBoxes.length; i++) {
		let cartBox = cartBoxes[i];

		let priceElement = cartBox.querySelector('.price-id');
		let quantityElement = cartBox.querySelector('.cart-quantity');

		let price = priceElement.innerText;
		let quantity = parseInt(quantityElement.value);

		cartProducts.push({
			price: price,
			quantity: quantity,
		});
	}

	return cartProducts;
}

let stripe = Stripe(
	'pk_live_51NmdWZKFt6b6LPuX1j9c56BGQetq7gCLPOk52FfLnqtymINA9p1pO5x9uLTQ8qWaXGrpwXNYiPgqxftbrhkGt95D00FVqdDi50'
);

document.getElementById('checkout').addEventListener('click', function () {
	let cartProducts = getCartProducts();

	let lineItems = [];

	lineItems.push({
		price: 'price_1Ny1rPKFt6b6LPuXbV7NeEWH', // Replace 'specific_item' with the actual price or identifier
		quantity: 1, // Replace with the desired quantity for the specific item
	});

	for (let i = 0; i < cartProducts.length; i++) {
		let product = cartProducts[i];
		lineItems.push({
			price: 'price_' + product.price,
			quantity: product.quantity,
		});
	}

	stripe.redirectToCheckout({
		lineItems: lineItems,
		mode: 'payment',
		successUrl: 'https://www.lifclo.pl/success.html',
		cancelUrl: 'https://www.lifclo.pl',
	});
});
