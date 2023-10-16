// menu height
let ItemsMenu = document.getElementById('MenuItems');

ItemsMenu.style.maxHeight = '0px';

function menutoggle() {
	if (ItemsMenu.style.maxHeight == '0px') {
		ItemsMenu.style.maxHeight = '200px';
	} else {
		ItemsMenu.style.maxHeight = '0px';
	}
}

//Changes color of the background
window.addEventListener('scroll', function () {
	let box = document.querySelector('.bg-video');
	let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	let scrollDistance = document.documentElement.scrollHeight - window.innerHeight;
	let scrollProgress = scrollTop / (scrollDistance * 0.3); // Adjusted scroll distance to 30% of the page

	// Calculate the RGB values for the gradient colors
	let startColor = [87, 56, 99]; // Replace with your desired start color
	let endColor = [228, 59, 59]; // Replace with your desired end color
	let currentColor = [];
	for (let i = 0; i < 3; i++) {
		currentColor[i] = Math.round(startColor[i] + (endColor[i] - startColor[i]) * scrollProgress);
	}

	// Set the box background color
	box.style.background = `rgb(${currentColor[0]}, ${currentColor[1]}, ${currentColor[2]})`;
});

const slides = document.querySelectorAll('.bg-video img');
let currentSlide = 0;

function showSlide(index) {
	slides[currentSlide].style.display = 'none';
	currentSlide = (index + slides.length) % slides.length;
	slides[currentSlide].style.display = 'block';
}

function nextSlide() {
	showSlide(currentSlide + 1);
}

setInterval(nextSlide, 700); // Zmieniaj slajdy co 1 sekundę

let cartIcon = document.querySelector('#cart-icon');
let cart = document.querySelector('.cart');
let closeCart = document.querySelector('#close-cart');

cartIcon.onclick = () => {
	cart.classList.add('active');
	loadCartFromStorage();
};

closeCart.onclick = () => {
	cart.classList.remove('active');
};

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
		alert('Please select a size (M/L/XL) before adding to cart.');
		return;
	}

	// Check if the product is already in the cart with the same name and size
	let cartItems = document.querySelectorAll('.cart-box');
	for (let i = 0; i < cartItems.length; i++) {
		let item = cartItems[i];
		let itemName = item.getAttribute('data-name');
		let itemSize = item.getAttribute('data-size');

		if (itemName === name && itemSize === selectedSize) {
			alert('Product already in cart');
			return;
		}
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

let MenuItems = document.getElementById('MenuItems');
MenuItems.style.maxHeight = '0px';

function menutoggle() {
	const MenuItems = document.getElementById('MenuItems');
	MenuItems.style.maxHeight = MenuItems.style.maxHeight === '0px' ? '200px' : '0px';
}

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
