document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const productsContainer = document.getElementById('products-container');
    const cartCount = document.getElementById('cart-count');
    const cartModal = document.getElementById('cart-modal');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const closeModal = document.querySelector('.close-modal');
    const cartLink = document.getElementById('cart-link');
    const contactForm = document.getElementById('contact-form');

    // API de productos (simulada)
    const products = [
        {
            id: 1,
            name: "Remera Fulbo",
            description: "Con un diseño exclusivo, esta remera es perfecta para quienes aman el deporte y buscan remeras de fútbol de calidad.",
            price: 15990,
            image: "Images/remera1.jpg"
        },
        {
            id: 2,
            name: "Remera Argentina 90 negra",
            description: "La remera Argentina 90 nace como inspiración de la casaca que usó Alemania para jugar la copa del mundo de la que, finalmente, salió campeón.",
            price: 16990,
            image: "Images/remera2.jpg"
        },
        {
            id: 3,
            name: "Remera GOYCO",
            description: "Remera temática GOYCO. Uno de los diseños más emblemáticos del fútbol en el mundial de Italia 90´, comienza a tomar popularidad principalmente, gracias a dos figuras internacionales del arco: Sergio Goycochea",
            price: 17490,
            image: "Images/remera3.jpg"
        }
    ];

    // Función para renderizar productos
    function renderProducts() {
        productsContainer.innerHTML = '';
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <div class="product-price">$${product.price.toLocaleString()}</div>
                    <button class="add-to-cart" data-id="${product.id}">Agregar al carrito</button>
                </div>
            `;
            productsContainer.appendChild(productCard);
        });

        // Event listeners para botones "Agregar al carrito"
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', addToCart);
        });
    }

    // Función para agregar producto al carrito
    function addToCart(e) {
        const productId = parseInt(e.target.getAttribute('data-id'));
        const product = products.find(p => p.id === productId);
        
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        
        updateCart();
        showMessage('Producto agregado al carrito', 'success');
    }

    // Función para actualizar el carrito
    function updateCart() {
        // Guardar en localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Actualizar contador
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Actualizar modal del carrito si está abierto
        if (cartModal.style.display === 'block') {
            renderCartItems();
        }
    }

    // Función para renderizar items del carrito
    function renderCartItems() {
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Tu carrito está vacío</p>';
            cartTotal.textContent = 'Total: $0';
            return;
        }
        
        let total = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toLocaleString()} x ${item.quantity}</p>
                </div>
                <div class="cart-item-controls">
                    <button class="decrease-quantity" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase-quantity" data-id="${item.id}">+</button>
                    <button class="remove-item" data-id="${item.id}">Eliminar</button>
                </div>
                <div class="cart-item-total">$${itemTotal.toLocaleString()}</div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
        
        cartTotal.textContent = `Total: $${total.toLocaleString()}`;
        
        // Event listeners para controles del carrito
        document.querySelectorAll('.decrease-quantity').forEach(button => {
            button.addEventListener('click', decreaseQuantity);
        });
        
        document.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', increaseQuantity);
        });
        
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', removeItem);
        });
    }

    // Funciones para manejar el carrito
    function decreaseQuantity(e) {
        const productId = parseInt(e.target.getAttribute('data-id'));
        const item = cart.find(item => item.id === productId);
        
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            cart = cart.filter(item => item.id !== productId);
        }
        
        updateCart();
    }

    function increaseQuantity(e) {
        const productId = parseInt(e.target.getAttribute('data-id'));
        const item = cart.find(item => item.id === productId);
        item.quantity += 1;
        updateCart();
    }

    function removeItem(e) {
        const productId = parseInt(e.target.getAttribute('data-id'));
        cart = cart.filter(item => item.id !== productId);
        updateCart();
    }

    // Función para mostrar mensajes
    function showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        
        document.body.insertBefore(messageDiv, document.body.firstChild);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }

    // Función para manejar el checkout
    function handleCheckout() {
        if (cart.length === 0) {
            showMessage('Tu carrito está vacío', 'error');
            return;
        }
        
        // Simular proceso de compra
        showMessage('Compra realizada con éxito!', 'success');
        cart = [];
        updateCart();
        cartModal.style.display = 'none';
    }

    // Event listeners
    cartLink.addEventListener('click', function(e) {
        e.preventDefault();
        cartModal.style.display = 'block';
        renderCartItems();
    });

    closeModal.addEventListener('click', function() {
        cartModal.style.display = 'none';
    });

    window.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });

    checkoutBtn.addEventListener('click', handleCheckout);

    // Validación del formulario de contacto
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(email)) {
            showMessage('Por favor ingresa un email válido', 'error');
            return;
        }
        
        // Enviar formulario (Formspree manejará el envío)
        this.submit();
        showMessage('Mensaje enviado con éxito!', 'success');
        this.reset();
    });

    // Inicializar
    renderProducts();
    updateCart(); // Para actualizar el contador al cargar la página
});