// Application State
let currentUser = null;
let products = [];
let categories = [];
let cart = [];
let orders = [];
let currentPage = 'home';
let currentCategory = null;
let selectedItems = [];

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    try {
        showSpinner();
        await loadProducts();
        await loadCategories();
        loadUserData();
        setupEventListeners();
        showPage('home');
        hideSpinner();
    } catch (error) {
        console.error('Error initializing app:', error);
        showToast('An error occurred while loading the application', 'error');
        hideSpinner();
    }
}

// API Functions
async function loadProducts() {
    try {
        const response = await fetch('https://dummyjson.com/products?limit=100');
        const data = await response.json();
        products = data.products;
        return products;
    } catch (error) {
        console.error('Error loading products:', error);
        throw error;
    }
}

async function loadCategories() {
    try {
        const response = await fetch('https://dummyjson.com/products/categories');
        categories = await response.json();
        return categories;
    } catch (error) {
        console.error('Error loading categories:', error);
        throw error;
    }
}

// Mobile Menu Functions
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const menuOpenIcon = document.getElementById('menuOpenIcon');
const menuCloseIcon = document.getElementById('menuCloseIcon');
const mobileSearchToggle = document.getElementById('mobileSearchToggle');
const mobileSearchBar = document.getElementById('mobileSearchBar');

mobileMenuToggle?.addEventListener('click', function() {
    const isOpen = !mobileMenu.classList.contains('hidden');
    if (isOpen) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
});

mobileSearchToggle?.addEventListener('click', function() {
    mobileSearchBar?.classList.toggle('hidden');
    if (!mobileSearchBar?.classList.contains('hidden')) {
        document.getElementById('mobileSearchInput')?.focus();
    }
});

function openMobileMenu() {
    mobileMenu?.classList.remove('hidden');
    menuOpenIcon?.classList.add('hidden');
    menuCloseIcon?.classList.remove('hidden');
    mobileSearchBar?.classList.add('hidden');
}

function closeMobileMenu() {
    mobileMenu?.classList.add('hidden');
    menuOpenIcon?.classList.remove('hidden');
    menuCloseIcon?.classList.add('hidden');
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const isClickInsideMenu = mobileMenu?.contains(event.target);
    const isClickOnToggle = mobileMenuToggle?.contains(event.target);
    
    if (!isClickInsideMenu && !isClickOnToggle && !mobileMenu?.classList.contains('hidden')) {
        closeMobileMenu();
    }
});

// Handle window resize
window.addEventListener('resize', function() {
    if (window.innerWidth >= 1024) {
        closeMobileMenu();
        mobileSearchBar?.classList.add('hidden');
    }
});

// UI Functions
function showSpinner() {
    document.getElementById('loadingSpinner')?.classList.remove('hidden');
}

function hideSpinner() {
    document.getElementById('loadingSpinner')?.classList.add('hidden');
}

function showPage(pageName, data = null) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.add('hidden');
    });

    // Show specific page
    const page = document.getElementById(pageName + 'Page');
    if (page) {
        page.classList.remove('hidden');
        page.classList.add('fade-in');
        currentPage = pageName;

        // Load page-specific content
        switch(pageName) {
            case 'home':
                renderHomePage();
                break;
            case 'categories':
                renderCategoriesPage();
                break;
            case 'categoryProducts':
                renderCategoryProducts(data);
                break;
            case 'productDetail':
                renderProductDetail(data);
                break;
            case 'cart':
                renderCartPage();
                break;
            case 'checkout':
                renderCheckoutPage();
                break;
            case 'profile':
                renderProfilePage();
                break;
        }
    }
}

// Page Rendering Functions
function renderHomePage() {
    renderCategoriesGrid();
    renderProductsGrid(products);
}

function renderCategoriesGrid() {
    const grid = document.getElementById('categoriesGrid');
    const limitedCategories = categories.slice(0, 6);
    
    if (grid) {
        grid.innerHTML = limitedCategories.map(category => `
            <div class="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                 onclick="showCategoryProducts('${category.slug}')">
                <div class="text-center">
                    <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <svg width="24" height="24" viewBox="0 0 448 512" fill="currentColor" class="text-orange-600">
                            <path d="M0 80V229.5c0 17 6.7 33.3 18.7 45.3l176 176c25 25 65.5 25 90.5 0L418.7 317.3c25-25 25-65.5 0-90.5l-176-176c-12-12-28.3-18.7-45.3-18.7H48C21.5 32 0 53.5 0 80zm112 32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/>
                        </svg>
                    </div>
                    <h4 class="font-medium text-gray-800 capitalize">${category.name}</h4>
                </div>
            </div>
        `).join('');
    }
}

function renderCategoriesPage() {
    const grid = document.getElementById('allCategoriesGrid');
    
    if (grid) {
        grid.innerHTML = categories.map(category => `
            <div class="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                 onclick="showCategoryProducts('${category.slug}')">
                <div class="flex items-center">
                    <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                        <svg width="24" height="24" viewBox="0 0 448 512" fill="currentColor" class="text-orange-600">
                            <path d="M0 80V229.5c0 17 6.7 33.3 18.7 45.3l176 176c25 25 65.5 25 90.5 0L418.7 317.3c25-25 25-65.5 0-90.5l-176-176c-12-12-28.3-18.7-45.3-18.7H48C21.5 32 0 53.5 0 80zm112 32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/>
                        </svg>
                    </div>
                    <div>
                        <h3 class="text-lg font-bold text-gray-800 capitalize">${category.name}</h3>
                        <p class="text-gray-600">View all products</p>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

async function showCategoryProducts(categorySlug) {
    try {
        showSpinner();
        const response = await fetch(`https://dummyjson.com/products/category/${categorySlug}`);
        const data = await response.json();
        currentCategory = categories.find(cat => cat.slug === categorySlug);
        hideSpinner();
        showPage('categoryProducts', data.products);
    } catch (error) {
        console.error('Error loading category products:', error);
        hideSpinner();
        showToast('Failed to load category products', 'error');
    }
}

function renderCategoryProducts(categoryProducts) {
    const titleElement = document.getElementById('categoryTitle');
    if (titleElement) {
        titleElement.textContent = currentCategory?.name || 'Category';
    }
    renderProductsGrid(categoryProducts, 'categoryProductsGrid');
}

function renderProductsGrid(productsToRender, gridId = 'productsGrid') {
    const grid = document.getElementById(gridId);
    
    if (grid) {
        grid.innerHTML = productsToRender.map(product => `
            <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                <div class="relative">
                    <img src="${product.thumbnail}" alt="${product.title}" 
                         class="w-full h-48 object-cover cursor-pointer"
                         onclick="showProductDetail(${product.id})">
                    <div class="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                        ⭐ ${product.rating}
                    </div>
                </div>
                <div class="p-4">
                    <h3 class="font-bold text-gray-800 mb-2 cursor-pointer hover:text-orange-600"
                        onclick="showProductDetail(${product.id})">${product.title}</h3>
                    <p class="text-gray-600 text-sm mb-3">${product.description.substring(0, 100)}...</p>
                    <div class="flex justify-between items-center">
                        <div>
                            <span class="text-lg font-bold text-orange-600">${product.price}</span>
                            ${product.discountPercentage ? `
                            <span class="text-sm text-gray-500 line-through ml-2">${(product.price / (1 - product.discountPercentage/100)).toFixed(2)}</span>
                            ` : ''}
                        </div>
                        <button onclick="addToCart(${product.id})" 
                                class="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function showProductDetail(productId) {
    if (!currentUser) {
        showToast('Please log in first to view product details', 'error');
        showLoginModal();
        return;
    }
    
    const product = products.find(p => p.id === productId);
    if (product) {
        showPage('productDetail', product);
    }
}

function renderProductDetail(product) {
    const detailContainer = document.getElementById('productDetail');
    
    if (detailContainer) {
        detailContainer.innerHTML = `
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <img src="${product.thumbnail}" alt="${product.title}" 
                         class="w-full h-96 object-cover rounded-lg mb-4">
                    <div class="grid grid-cols-4 gap-2">
                        ${product.images.slice(0, 4).map(img => `
                            <img src="${img}" alt="${product.title}" 
                                 class="w-full h-20 object-cover rounded-lg border-2 border-gray-200 hover:border-orange-500 cursor-pointer">
                        `).join('')}
                    </div>
                </div>
                <div>
                    <h1 class="text-3xl font-bold text-gray-800 mb-4">${product.title}</h1>
                    <div class="flex items-center mb-4">
                        <div class="flex text-yellow-400 mr-2">
                            ${Array(5).fill().map((_, i) => `
                                <span class="text-xl ${i < Math.floor(product.rating) ? '⭐' : '☆'}"></span>
                            `).join('')}
                        </div>
                        <span class="text-gray-600">(${product.rating} rating)</span>
                    </div>
                    <div class="mb-6">
                        <span class="text-3xl font-bold text-orange-600">${product.price}</span>
                        ${product.discountPercentage ? `
                            <span class="text-lg text-gray-500 line-through ml-2">${(product.price / (1 - product.discountPercentage/100)).toFixed(2)}</span>
                            <span class="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm ml-2">${product.discountPercentage}% OFF</span>
                        ` : ''}
                    </div>
                    <div class="mb-6">
                        <h3 class="text-lg font-bold text-gray-800 mb-2">Description</h3>
                        <p class="text-gray-600">${product.description}</p>
                    </div>
                    <div class="mb-6">
                        <h3 class="text-lg font-bold text-gray-800 mb-2">Category</h3>
                        <span class="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm capitalize">${product.category}</span>
                    </div>
                    <div class="mb-6">
                        <h3 class="text-lg font-bold text-gray-800 mb-2">Brand</h3>
                        <span class="text-gray-600">${product.brand || 'N/A'}</span>
                    </div>
                    <div class="mb-6">
                        <h3 class="text-lg font-bold text-gray-800 mb-2">Stock</h3>
                        <span class="text-green-600 font-medium">${product.stock} available</span>
                    </div>
                    <div class="flex gap-4">
                        <button onclick="addToCart(${product.id})" 
                                class="flex-1 bg-orange-600 text-white py-3 px-6 rounded-lg hover:bg-orange-700 transition-colors">
                            Add to Cart
                        </button>
                        <button onclick="buyNow(${product.id})" 
                                class="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors">
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
}

// Cart Functions
function addToCart(productId) {
    if (!currentUser) {
        showToast('Please log in first to add products to your cart', 'error');
        showLoginModal();
        return;
    }
    
    const product = products.find(p => p.id === productId);
    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        updateCartBadge();
        saveCartData();
        showToast('Product added to cart');
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    selectedItems = selectedItems.filter(id => id !== productId);
    updateCartBadge();
    saveCartData();
    if (currentPage === 'cart') {
        renderCartPage();
    }
    showToast('Product removed from cart');
}

function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            updateCartBadge();
            saveCartData();
            if (currentPage === 'cart') {
                renderCartPage();
            }
        }
    }
}

function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    const mobileBadge = document.getElementById('mobileCartBadge');
    
    if (!currentUser) {
        badge?.classList.add('hidden');
        mobileBadge?.classList.add('hidden');
        return;
    }
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (totalItems > 0) {
        [badge, mobileBadge].forEach(b => {
            if (b) {
                b.textContent = totalItems;
                b.classList.remove('hidden');
                b.classList.add('cart-badge');
            }
        });
    } else {
        [badge, mobileBadge].forEach(b => {
            if (b) {
                b.classList.add('hidden');
            }
        });
    }
}

// Cart Page Functions
function showCartPage() {
    if (!currentUser) {
        showToast('Please log in first to access the cart', 'error');
        showLoginModal();
        return;
    }
    showPage('cart');
}

function toggleItemSelection(productId) {
    const index = selectedItems.indexOf(productId);
    if (index > -1) {
        selectedItems.splice(index, 1);
    } else {
        selectedItems.push(productId);
    }
    updateCheckoutButton();
    updateSelectAllCheckbox();
}

function selectAllItems() {
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    if (selectAllCheckbox?.checked) {
        selectedItems = cart.map(item => item.id);
    } else {
        selectedItems = [];
    }
    updateCheckoutButton();
    renderCartPage();
}

function updateSelectAllCheckbox() {
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    if (selectAllCheckbox) {
        selectAllCheckbox.checked = selectedItems.length === cart.length && cart.length > 0;
        selectAllCheckbox.indeterminate = selectedItems.length > 0 && selectedItems.length < cart.length;
    }
}

function updateCheckoutButton() {
    const checkoutButton = document.getElementById('checkoutButton');
    const selectedTotal = document.getElementById('selectedTotal');
    const selectedItemsCounter = document.getElementById('selectedItemsCounter');
    
    if (checkoutButton && selectedTotal) {
        const selectedCartItems = cart.filter(item => selectedItems.includes(item.id));
        const total = selectedCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        if (selectedItemsCounter) {
            selectedItemsCounter.textContent = `${selectedItems.length} of ${cart.length} items selected`;
        }
        
        if (selectedItems.length > 0) {
            checkoutButton.disabled = false;
            checkoutButton.classList.remove('bg-gray-400', 'cursor-not-allowed');
            checkoutButton.classList.add('bg-green-600', 'hover:bg-green-700');
            selectedTotal.textContent = `${total.toFixed(2)}`;
            checkoutButton.innerHTML = `Checkout Selected Items (${selectedItems.length})`;
        } else {
            checkoutButton.disabled = true;
            checkoutButton.classList.add('bg-gray-400', 'cursor-not-allowed');
            checkoutButton.classList.remove('bg-green-600', 'hover:bg-green-700');
            selectedTotal.textContent = '$0.00';
            checkoutButton.innerHTML = `Checkout Selected Items (0)`;
        }
    }
}

function renderCartPage() {
    const cartContent = document.getElementById('cartContent');
    
    if (!cartContent) return;
    
    if (cart.length === 0) {
        cartContent.innerHTML = `
            <div class="text-center py-12">
                <h3 class="text-xl font-bold text-gray-600 mb-2">Cart is Empty</h3>
                <p class="text-gray-500 mb-6">No products in your cart yet</p>
                <button onclick="showPage('home')" class="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700">
                    Start Shopping
                </button>
            </div>
        `;
        return;
    }

    const totalAllItems = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const selectedCartItems = cart.filter(item => selectedItems.includes(item.id));
    const selectedTotal = selectedCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    cartContent.innerHTML = `
        <!-- Select All Header -->
        <div class="bg-white rounded-lg shadow-md p-4 mb-4">
            <div class="flex items-center justify-between">
                <label class="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" id="selectAllCheckbox" 
                           onchange="selectAllItems()" 
                           class="w-5 h-5 text-orange-600 rounded focus:ring-2 focus:ring-orange-500">
                    <span class="font-medium text-gray-700">Select All (${cart.length} items)</span>
                </label>
                <span class="text-sm text-gray-500">Total All: ${totalAllItems.toFixed(2)}</span>
            </div>
        </div>

        <!-- Cart Items -->
        <div class="space-y-4">
            ${cart.map(item => `
                <div class="bg-white rounded-lg shadow-md p-6 ${selectedItems.includes(item.id) ? 'ring-2 ring-orange-200 bg-orange-50' : ''}">
                    <div class="flex items-center space-x-4">
                        <!-- Checkbox -->
                        <input type="checkbox" 
                               ${selectedItems.includes(item.id) ? 'checked' : ''}
                               onchange="toggleItemSelection(${item.id})"
                               class="w-5 h-5 text-orange-600 rounded focus:ring-2 focus:ring-orange-500">
                        
                        <!-- Product Image -->
                        <img src="${item.thumbnail}" alt="${item.title}" class="w-20 h-20 object-cover rounded-lg">
                        
                        <!-- Product Info -->
                        <div class="flex-1">
                            <h3 class="font-bold text-gray-800">${item.title}</h3>
                            <p class="text-gray-600">${item.price}</p>
                        </div>
                        
                        <!-- Quantity Controls -->
                        <div class="flex items-center space-x-3">
                            <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})"
                                    class="bg-gray-200 text-gray-700 w-7 h-7 rounded-full hover:bg-gray-300 flex items-center justify-center">
                                -
                            </button>
                            <span class="w-8 text-center font-medium">${item.quantity}</span>
                            <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})"
                                    class="bg-gray-200 text-gray-700 w-7 h-7 rounded-full hover:bg-gray-300 flex items-center justify-center">
                                +
                            </button>
                        </div>
                        
                        <!-- Price and Delete -->
                        <div class="text-right">
                            <p class="font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                            <button onclick="removeFromCart(${item.id})" 
                                    class="text-red-600 hover:text-red-800 text-sm">
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <!-- Checkout Summary -->
        <div class="bg-white rounded-lg shadow-md p-6 mt-6 sticky bottom-4">
            <div class="flex flex-col space-y-4">
                <div class="flex justify-between items-center">
                    <div class="text-sm text-gray-600">
                        <span id="selectedItemsCounter">${selectedItems.length} of ${cart.length} items selected</span>
                    </div>
                    <div class="text-right">
                        <p class="text-sm text-gray-600">Total selected:</p>
                        <span id="selectedTotal" class="text-2xl font-bold text-orange-600">${selectedTotal.toFixed(2)}</span>
                    </div>
                </div>
                <button id="checkoutButton" 
                        onclick="proceedToCheckout()" 
                        ${selectedItems.length === 0 ? 'disabled' : ''}
                        class="w-full py-3 px-6 rounded-lg transition-colors ${selectedItems.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white">
                    Checkout Selected Items (${selectedItems.length})
                </button>
            </div>
        </div>
    `;

    setTimeout(() => {
        updateSelectAllCheckbox();
        updateCheckoutButton();
    }, 0);
}

function proceedToCheckout() {
    if (!currentUser) {
        showToast('Please log in first', 'error');
        showLoginModal();
        return;
    }
    
    if (selectedItems.length === 0) {
        showToast('Select at least 1 product', 'error');
        return;
    }
    
    showPage('checkout');
}

function buyNow(productId) {
    if (!currentUser) {
        showToast('Please log in first to make a purchase', 'error');
        showLoginModal();
        return;
    }
    
    addToCart(productId);
    selectedItems = [productId];
    proceedToCheckout();
}

function renderCheckoutPage() {
    const checkoutSummary = document.getElementById('checkoutSummary');
    
    if (!checkoutSummary) return;
    
    const selectedCartItems = cart.filter(item => selectedItems.includes(item.id));
    const total = selectedCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCost = 10;
    const grandTotal = total + shippingCost;

    checkoutSummary.innerHTML = `
        <div class="space-y-4">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p class="text-sm text-blue-800">
                    Checkout ${selectedCartItems.length} selected items
                </p>
            </div>
            
            ${selectedCartItems.map(item => `
                <div class="flex justify-between items-center py-2 border-b">
                    <div class="flex items-center space-x-3">
                        <img src="${item.thumbnail}" alt="${item.title}" class="w-12 h-12 object-cover rounded">
                        <div>
                            <p class="font-medium text-sm">${item.title}</p>
                            <p class="text-gray-600 text-xs">Qty: ${item.quantity}</p>
                        </div>
                    </div>
                    <span class="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `).join('')}
            
            <div class="space-y-2 pt-4">
                <div class="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${total.toFixed(2)}</span>
                </div>
                <div class="flex justify-between">
                    <span>Shipping:</span>
                    <span>${shippingCost.toFixed(2)}</span>
                </div>
                <div class="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span class="text-orange-600">${grandTotal.toFixed(2)}</span>
                </div>
            </div>
            
            <button onclick="processOrder()" 
                    class="w-full bg-orange-600 text-white py-3 px-6 rounded-lg hover:bg-orange-700 transition-colors mt-6">
                Place Order
            </button>
        </div>
    `;
}

function processOrder() {
    const form = document.getElementById('checkoutForm');
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const selectedCartItems = cart.filter(item => selectedItems.includes(item.id));
    const total = selectedCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCost = 10;
    const grandTotal = total + shippingCost;

    const order = {
        id: Date.now(),
        date: new Date().toISOString(),
        items: [...selectedCartItems],
        total: grandTotal,
        status: 'pending',
        shipping: {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value
        },
        paymentMethod: document.getElementById('paymentMethod').value
    };

    orders.push(order);
    
    cart = cart.filter(item => !selectedItems.includes(item.id));
    selectedItems = [];
    
    updateCartBadge();
    saveOrderData();
    saveCartData();

    showToast('Order placed successfully!');
    showPage('profile');
}

// Profile and Authentication Functions
function renderProfilePage() {
    const profilePage = document.getElementById('profilePage');
    
    if (!profilePage) return;
    
    if (!currentUser) {
        profilePage.innerHTML = `
            <div class="text-center py-12">
                <h3 class="text-xl font-bold text-gray-600 mb-2">Not Logged In</h3>
                <p class="text-gray-500 mb-6">Please log in to view your profile</p>
                <button onclick="showLoginModal()" class="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700">
                    Login
                </button>
            </div>
        `;
        return;
    }
    
    const profileInfo = document.getElementById('profileInfo');
    const orderHistory = document.getElementById('orderHistory');

    if (profileInfo) {
        profileInfo.innerHTML = `
            <div class="text-center mb-6">
                <div class="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span class="text-orange-600 text-2xl">👤</span>
                </div>
                <h3 class="text-xl font-bold text-gray-800">${currentUser.name}</h3>
                <p class="text-gray-600">${currentUser.email}</p>
                <button onclick="showEditProfile()" class="mt-3 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 text-sm">
                    Edit Profile
                </button>
            </div>
            <div class="space-y-4">
                <div class="flex justify-between py-2 border-b">
                    <span class="text-gray-600">Total orders:</span>
                    <span class="font-medium">${orders.length}</span>
                </div>
                <div class="flex justify-between py-2 border-b">
                    <span class="text-gray-600">Member since:</span>
                    <span class="font-medium">${new Date(currentUser.joinDate).toLocaleDateString()}</span>
                </div>
            </div>
        `;
    }

    if (orderHistory) {
        if (orders.length === 0) {
            orderHistory.innerHTML = `
                <div class="text-center py-8">
                    <p class="text-gray-500">No order history yet</p>
                </div>
            `;
        } else {
            orderHistory.innerHTML = `
                <div class="space-y-4">
                    ${orders.map(order => `
                        <div class="border rounded-lg p-4">
                            <div class="flex justify-between items-start mb-3">
                                <div>
                                    <p class="font-bold text-gray-800">Order #${order.id}</p>
                                    <p class="text-sm text-gray-600">${new Date(order.date).toLocaleDateString()}</p>
                                </div>
                                <span class="px-3 py-1 rounded-full text-sm ${
                                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    'bg-red-100 text-red-800'
                                }">${order.status}</span>
                            </div>
                            <div class="space-y-2 mb-3">
                                ${order.items.slice(0, 2).map(item => `
                                    <div class="flex items-center space-x-3">
                                        <img src="${item.thumbnail}" alt="${item.title}" class="w-10 h-10 object-cover rounded">
                                        <div class="flex-1">
                                            <p class="text-sm font-medium">${item.title}</p>
                                            <p class="text-xs text-gray-600">Qty: ${item.quantity}</p>
                                        </div>
                                    </div>
                                `).join('')}
                                ${order.items.length > 2 ? `<p class="text-sm text-gray-600">+${order.items.length - 2} more items</p>` : ''}
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="font-bold">Total: ${order.total.toFixed(2)}</span>
                                <button onclick="viewOrderDetail(${order.id})" class="text-orange-600 hover:text-orange-800 text-sm">
                                    View Details
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }
}

function viewOrderDetail(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        alert(`Order Details #${order.id}\n\nStatus: ${order.status}\nTotal: ${order.total.toFixed(2)}\nDate: ${new Date(order.date).toLocaleDateString()}`);
    }
}

// Authentication Functions
function showLoginModal() {
    document.getElementById('loginModal')?.classList.remove('hidden');
    clearLoginErrors();
}

function closeLoginModal() {
    document.getElementById('loginModal')?.classList.add('hidden');
    document.getElementById('loginForm')?.reset();
    clearLoginErrors();
}

function clearLoginErrors() {
    document.querySelectorAll('.login-error').forEach(el => el.remove());
}

function showLoginError(message) {
    clearLoginErrors();
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'login-error bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4';
    errorDiv.innerHTML = `
        <div class="flex items-center">
            <span>${message}</span>
        </div>
    `;
    
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.insertBefore(errorDiv, loginForm.firstChild);
    }
}

function showRegisterForm() {
    const registerModalHTML = `
        <div id="registerModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                <div class="p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-xl font-bold text-gray-800">Register Account</h2>
                        <button onclick="closeRegisterModal()" class="text-gray-400 hover:text-gray-600">×</button>
                    </div>
                    
                    <form id="registerForm" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
                            <input type="text" id="registerName" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" required>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input type="email" id="registerEmail" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" required>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <input type="password" id="registerPassword" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" required>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                            <input type="password" id="confirmPassword" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" required>
                        </div>
                        
                        <button type="submit" class="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition duration-200">
                            Register
                        </button>
                    </form>
                    
                    <div class="mt-4 text-center">
                        <button onclick="switchToLogin()" class="text-orange-600 hover:text-orange-800 text-sm">
                            Already have an account? Login here
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const existingModal = document.getElementById('registerModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    document.body.insertAdjacentHTML('beforeend', registerModalHTML);
    closeLoginModal();
    
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
}

function closeRegisterModal() {
    const modal = document.getElementById('registerModal');
    if (modal) {
        modal.remove();
    }
}

function switchToLogin() {
    closeRegisterModal();
    showLoginModal();
}

function showRegisterError(message) {
    const existingError = document.querySelector('#registerModal .register-error');
    if (existingError) {
        existingError.remove();
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'register-error bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4';
    errorDiv.innerHTML = `<span>${message}</span>`;
    
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.insertBefore(errorDiv, registerForm.firstChild);
    }
}

function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (!name || name.length < 2) {
        showRegisterError('Name must be at least 2 characters long');
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showRegisterError('Please enter a valid email address');
        return;
    }
    
    if (password.length < 6) {
        showRegisterError('Password must be at least 6 characters long');
        return;
    }
    
    if (password !== confirmPassword) {
        showRegisterError('Passwords do not match');
        return;
    }
    
    const existingUsers = JSON.parse(localStorage.getItem('jeansyshop_users') || '[]');
    const userExists = existingUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
    
    if (userExists) {
        showRegisterError('An account with this email already exists');
        return;
    }
    
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password,
        joinDate: new Date().toISOString()
    };
    
    existingUsers.push(newUser);
    localStorage.setItem('jeansyshop_users', JSON.stringify(existingUsers));
    localStorage.setItem('modernshop_user', JSON.stringify(newUser));
    currentUser = newUser;
    
    updateAuthUI();
    updateCartBadge();
    closeRegisterModal();
    showToast('Registration successful! Welcome to Jeansy!');
}

function login(email, password) {
    if (!email || !password) {
        showLoginError('Email and password are required');
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showLoginError('Please enter a valid email address');
        return;
    }
    
    const registeredUsers = JSON.parse(localStorage.getItem('jeansyshop_users') || '[]');
    const user = registeredUsers.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    
    if (!user) {
        showLoginError('Invalid email or password. Please check your credentials and try again.');
        return;
    }
    
    localStorage.setItem('modernshop_user', JSON.stringify(user));
    currentUser = user;
    
    // Load user's saved data (cart and orders)
    const savedUserData = localStorage.getItem(`user_${user.id}_data`);
    if (savedUserData) {
        const userData = JSON.parse(savedUserData);
        cart = userData.cart || [];
        orders = userData.orders || [];
    } else {
        cart = [];
        orders = [];
    }
    
    updateAuthUI();
    updateCartBadge();
    closeLoginModal();
    showToast(`Welcome back, ${user.name}!`);
}

function logout() {
    // Save current user's cart and orders before logout
    if (currentUser) {
        const userData = {
            cart: cart,
            orders: orders
        };
        localStorage.setItem(`user_${currentUser.id}_data`, JSON.stringify(userData));
    }
    
    currentUser = null;
    cart = [];
    selectedItems = [];
    orders = [];
    localStorage.removeItem('modernshop_user');
    updateAuthUI();
    updateCartBadge();
    showToast('Logged out successfully!');
    if (currentPage === 'profile' || currentPage === 'cart') {
        showPage('home');
    }
}

function updateAuthUI() {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const mobileLoginBtn = document.getElementById('mobileLoginBtn');
    const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
    
    if (currentUser) {
        loginBtn?.classList.add('hidden');
        logoutBtn?.classList.remove('hidden');
        mobileLoginBtn?.classList.add('hidden');
        mobileLogoutBtn?.classList.remove('hidden');
        
        if (logoutBtn) logoutBtn.textContent = `Logout (${currentUser.name})`;
        if (mobileLogoutBtn) mobileLogoutBtn.textContent = `Logout (${currentUser.name})`;
    } else {
        loginBtn?.classList.remove('hidden');
        logoutBtn?.classList.add('hidden');
        mobileLoginBtn?.classList.remove('hidden');
        mobileLogoutBtn?.classList.add('hidden');
    }
}

function showEditProfile() {
    document.getElementById('editProfileModal')?.classList.remove('hidden');
    const editName = document.getElementById('editName');
    const editEmail = document.getElementById('editEmail');
    
    if (editName && currentUser) editName.value = currentUser.name;
    if (editEmail && currentUser) editEmail.value = currentUser.email;
}

function closeEditProfile() {
    document.getElementById('editProfileModal')?.classList.add('hidden');
}

function saveProfile() {
    const newName = document.getElementById('editName')?.value.trim();
    const newEmail = document.getElementById('editEmail')?.value.trim();
    
    if (!newName || !newEmail) {
        showToast('Name and email cannot be empty!', 'error');
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
        showToast('Invalid email format!', 'error');
        return;
    }
    
    if (currentUser) {
        currentUser.name = newName;
        currentUser.email = newEmail;
        
        localStorage.setItem('modernshop_user', JSON.stringify(currentUser));
        
        updateAuthUI();
        renderProfilePage();
        closeEditProfile();
        
        showToast('Profile updated successfully!');
    }
}

// Search and Event Listener Functions
function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const mobileSearchInput = document.getElementById('mobileSearchInput');
    const sortSelect = document.getElementById('sortSelect');
    const loginForm = document.getElementById('loginForm');
    const checkoutForm = document.getElementById('checkoutForm');
    
    searchInput?.addEventListener('input', debounce(handleSearch, 300));
    searchInput?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch(e);
        }
    });
    
    // Sync search inputs
    if (searchInput && mobileSearchInput) {
        searchInput.addEventListener('input', function() {
            mobileSearchInput.value = this.value;
        });

        mobileSearchInput.addEventListener('input', function() {
            searchInput.value = this.value;
            handleSearch({target: this});
        });
    }
    
    sortSelect?.addEventListener('change', handleSort);
    loginForm?.addEventListener('submit', handleLogin);
    
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            processOrder();
        });
    }
}

function handleSearch(e) {
    const query = e.target.value.toLowerCase().trim();
    
    if (query === '') {
        if (currentPage === 'home') {
            renderProductsGrid(products);
        } else if (currentPage === 'categoryProducts') {
            showCategoryProducts(currentCategory.slug);
        }
        clearSearchResults();
        return;
    }
    
    let productsToFilter = products;
    
    if (currentPage === 'categoryProducts') {
        productsToFilter = products.filter(p => p.category === currentCategory.slug);
    }
    
    const filteredProducts = productsToFilter.filter(product => 
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        (product.brand && product.brand.toLowerCase().includes(query))
    );
    
    const gridId = currentPage === 'categoryProducts' ? 'categoryProductsGrid' : 'productsGrid';
    renderProductsGrid(filteredProducts, gridId);
    showSearchResults(query, filteredProducts.length);
}

function showSearchResults(query, count) {
    clearSearchResults();
    
    const searchInfo = document.createElement('div');
    searchInfo.className = 'search-results-info bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6';
    searchInfo.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="text-orange-800">
                    Showing ${count} results for "${query}"
                </p>
            </div>
            <button onclick="clearSearch()" class="text-orange-600 hover:text-orange-800 text-sm">
                Clear search
            </button>
        </div>
    `;
    
    const currentPageElement = document.querySelector('.page:not(.hidden)');
    if (currentPageElement) {
        const firstChild = currentPageElement.firstElementChild;
        if (firstChild) {
            firstChild.insertAdjacentElement('afterend', searchInfo);
        }
    }
}

function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    const mobileSearchInput = document.getElementById('mobileSearchInput');
    
    if (searchInput) searchInput.value = '';
    if (mobileSearchInput) mobileSearchInput.value = '';
    
    clearSearchResults();
    
    if (currentPage === 'home') {
        renderProductsGrid(products);
    } else if (currentPage === 'categoryProducts') {
        showCategoryProducts(currentCategory.slug);
    }
}

function clearSearchResults() {
    const existingInfo = document.querySelector('.search-results-info');
    if (existingInfo) {
        existingInfo.remove();
    }
}

function handleSort(e) {
    const sortBy = e.target.value;
    const searchQuery = document.getElementById('searchInput')?.value.toLowerCase().trim() || '';
    
    let productsToSort = products;
    
    if (searchQuery !== '') {
        if (currentPage === 'categoryProducts') {
            productsToSort = products.filter(p => p.category === currentCategory.slug);
        }
        
        productsToSort = productsToSort.filter(product => 
            product.title.toLowerCase().includes(searchQuery) ||
            product.description.toLowerCase().includes(searchQuery) ||
            product.category.toLowerCase().includes(searchQuery) ||
            (product.brand && product.brand.toLowerCase().includes(searchQuery))
        );
    } else if (currentPage === 'categoryProducts') {
        productsToSort = products.filter(p => p.category === currentCategory.slug);
    }
    
    let sortedProducts = [...productsToSort];
    
    switch(sortBy) {
        case 'price-asc':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            sortedProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'name-asc':
            sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'name-desc':
            sortedProducts.sort((a, b) => b.title.localeCompare(a.title));
            break;
        default:
            break;
    }
    
    const gridId = currentPage === 'categoryProducts' ? 'categoryProductsGrid' : 'productsGrid';
    renderProductsGrid(sortedProducts, gridId);
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail')?.value;
    const password = document.getElementById('loginPassword')?.value;
    login(email, password);
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg text-white z-50 transform transition-all duration-300 ${
        type === 'error' ? 'bg-red-600' : 'bg-green-600'
    }`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Data Persistence Functions
function saveCartData() {
    if (currentUser) {
        const userData = {
            cart: cart,
            orders: orders
        };
        localStorage.setItem(`user_${currentUser.id}_data`, JSON.stringify(userData));
    }
}

function saveOrderData() {
    if (currentUser) {
        const userData = {
            cart: cart,
            orders: orders
        };
        localStorage.setItem(`user_${currentUser.id}_data`, JSON.stringify(userData));
    }
}

function loadUserData() {
    const savedUser = localStorage.getItem('modernshop_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateAuthUI();
        
        // Load user-specific data
        const savedUserData = localStorage.getItem(`user_${currentUser.id}_data`);
        if (savedUserData) {
            const userData = JSON.parse(savedUserData);
            cart = userData.cart || [];
            orders = userData.orders || [];
        } else {
            cart = [];
            orders = [];
        }
    }
    
    updateCartBadge();
}

// Setup test users for demo purposes
function setupTestUsers() {
    const testUsers = [
        {
            id: 1,
            name: 'Test User',
            email: 'test@example.com',
            password: '123456',
            joinDate: new Date().toISOString()
        }
    ];
    
    const existingUsers = JSON.parse(localStorage.getItem('jeansyshop_users') || '[]');
    if (existingUsers.length === 0) {
        localStorage.setItem('jeansyshop_users', JSON.stringify(testUsers));
    }
}