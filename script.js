        // Application State
        let currentUser = null;
        let products = [];
        let categories = [];
        let cart = [];
        let orders = [];
        let currentPage = 'home';
        let currentCategory = null;

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
                showToast('Terjadi kesalahan saat memuat aplikasi', 'error');
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

        // UI Functions
        function showSpinner() {
            document.getElementById('loadingSpinner').classList.remove('hidden');
        }

        function hideSpinner() {
            document.getElementById('loadingSpinner').classList.add('hidden');
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

        function renderHomePage() {
            renderCategoriesGrid();
            renderProductsGrid(products);
        }

        function renderCategoriesGrid() {
            const grid = document.getElementById('categoriesGrid');
            const limitedCategories = categories.slice(0, 6);
            
            grid.innerHTML = limitedCategories.map(category => `
                <div class="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                     onclick="showCategoryProducts('${category.slug}')">
                    <div class="text-center">
                        <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 448 512" fill="currentColor" class="text-orange-600">
                            <path d="M0 80V229.5c0 17 6.7 33.3 18.7 45.3l176 176c25 25 65.5 25 90.5 0L418.7 317.3c25-25 25-65.5 0-90.5l-176-176c-12-12-28.3-18.7-45.3-18.7H48C21.5 32 0 53.5 0 80zm112 32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/>
                            </svg>
                        </div>
                        <h4 class="font-medium text-gray-800 capitalize">${category.name}</h4>
                    </div>
                </div>
            `).join('');
        }

        function renderCategoriesPage() {
            const grid = document.getElementById('allCategoriesGrid');
            
            grid.innerHTML = categories.map(category => `
                <div class="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                     onclick="showCategoryProducts('${category.slug}')">
                    <div class="flex items-center">
                        <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 448 512" fill="currentColor" class="text-orange-600">
                            <path d="M0 80V229.5c0 17 6.7 33.3 18.7 45.3l176 176c25 25 65.5 25 90.5 0L418.7 317.3c25-25 25-65.5 0-90.5l-176-176c-12-12-28.3-18.7-45.3-18.7H48C21.5 32 0 53.5 0 80zm112 32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/>
                            </svg>
                        </div>
                        <div>
                            <h3 class="text-lg font-bold text-gray-800 capitalize">${category.name}</h3>
                            <p class="text-gray-600">Lihat semua produk</p>
                        </div>
                    </div>
                </div>
            `).join('');
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
                showToast('Gagal memuat produk kategori', 'error');
            }
        }

        function renderCategoryProducts(categoryProducts) {
            document.getElementById('categoryTitle').textContent = currentCategory?.name || 'Kategori';
            renderProductsGrid(categoryProducts, 'categoryProductsGrid');
        }

        function renderProductsGrid(productsToRender, gridId = 'productsGrid') {
            const grid = document.getElementById(gridId);
            
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
                        <h3 class="font-bold text-gray-800 mb-2 line-clamp-2 cursor-pointer hover:text-orange-600"
                            onclick="showProductDetail(${product.id})">${product.title}</h3>
                        <p class="text-gray-600 text-sm mb-3 line-clamp-2">${product.description}</p>
                        <div class="flex justify-between items-center">
                            <div>
                                <span class="text-lg font-bold text-orange-600">$${product.price}</span>
                                ${product.discountPercentage ? `
                                <span class="text-sm text-gray-500 line-through ml-2">$${(product.price / (1 - product.discountPercentage/100)).toFixed(2)}</span>
                                ` : ''}
                            </div>
                            <button onclick="addToCart(${product.id})" 
                                    class="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                                <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                           </svg>
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
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
                                    <i class="fas fa-star ${i < Math.floor(product.rating) ? '' : 'text-gray-300'}"></i>
                                `).join('')}
                            </div>
                            <span class="text-gray-600">(${product.rating} rating)</span>
                        </div>
                        <div class="mb-6">
                            <span class="text-3xl font-bold text-orange-600">$${product.price}</span>
                            ${product.discountPercentage ? `
                                <span class="text-lg text-gray-500 line-through ml-2">$${(product.price / (1 - product.discountPercentage/100)).toFixed(2)}</span>
                                <span class="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm ml-2">${product.discountPercentage}% OFF</span>
                            ` : ''}
                        </div>
                        <div class="mb-6">
                            <h3 class="text-lg font-bold text-gray-800 mb-2">Deskripsi</h3>
                            <p class="text-gray-600">${product.description}</p>
                        </div>
                        <div class="mb-6">
                            <h3 class="text-lg font-bold text-gray-800 mb-2">Kategori</h3>
                            <span class="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm capitalize">${product.category}</span>
                        </div>
                        <div class="mb-6">
                            <h3 class="text-lg font-bold text-gray-800 mb-2">Brand</h3>
                            <span class="text-gray-600">${product.brand}</span>
                        </div>
                        <div class="mb-6">
                            <h3 class="text-lg font-bold text-gray-800 mb-2">Stok</h3>
                            <span class="text-green-600 font-medium">${product.stock} tersedia</span>
                        </div>
                        <div class="flex gap-4">
                            <button onclick="addToCart(${product.id})" 
                                    class="flex-1 bg-orange-600 text-white py-3 px-6 rounded-lg hover:bg-orange-700 transition-colors">
                                <i class="fas fa-cart-plus mr-2"></i>Tambah ke Keranjang
                            </button>
                            <button onclick="buyNow(${product.id})" 
                                    class="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors">
                                <i class="fas fa-bolt mr-2"></i>Beli Sekarang
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
        

// Global variables for selected items
        let selectedItems = [];

        // Cart Functions
        function addToCart(productId) {
    if (!currentUser) {
        showToast('Please log in first to add products to your basket', 'error');
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
        showToast('Product add  to cart');
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
    
    // Jika user belum login, sembunyikan badge
    if (!currentUser) {
        badge.classList.add('hidden');
        return;
    }
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (totalItems > 0) {
        badge.textContent = totalItems;
        badge.classList.remove('hidden');
        badge.classList.add('cart-badge');
    } else {
        badge.classList.add('hidden');
    }
}

        // Checklist functions
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
            if (selectAllCheckbox.checked) {
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
                selectAllCheckbox.checked = selectedItems.length === cart.length && cart.length > 0 ;
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
        
        // Update counter item yang dipilih
        if (selectedItemsCounter) {
            selectedItemsCounter.textContent = `${selectedItems.length} for ${cart.length} item selected`;
        }
        
        if (selectedItems.length > 0) {
            checkoutButton.disabled = false;
            checkoutButton.classList.remove('bg-gray-400', 'cursor-not-allowed');
            checkoutButton.classList.add('bg-green-600', 'hover:bg-green-700');
            selectedTotal.textContent = `$${total.toFixed(2)}`;
            checkoutButton.innerHTML = `
                <svg class="mr-2 inline-block" width="16" height="16" viewBox="0 0 576 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M64 32C28.7 32 0 60.7 0 96v32H576V96c0-35.3-28.7-64-64-64H64zM576 224H0V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V224zM112 352h64c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16zm112 16c0-8.8 7.2-16 16-16H368c8.8 0 16 7.2 16 16s-7.2 16-16 16H240c-8.8 0-16-7.2-16-16z"/>
                </svg>Checkout selected item(${selectedItems.length})
            `;
        } else {
            checkoutButton.disabled = true;
            checkoutButton.classList.add('bg-gray-400', 'cursor-not-allowed');
            checkoutButton.classList.remove('bg-green-600', 'hover:bg-green-700');
            selectedTotal.textContent = '$0.00';
            checkoutButton.innerHTML = `
                <svg class="mr-2 inline-block" width="16" height="16" viewBox="0 0 576 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M64 32C28.7 32 0 60.7 0 96v32H576V96c0-35.3-28.7-64-64-64H64zM576 224H0V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V224zM112 352h64c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16zm112 16c0-8.8 7.2-16 16-16H368c8.8 0 16 7.2 16 16s-7.2 16-16 16H240c-8.8 0-16-7.2-16-16z"/>
                </svg>Checkout selected Item  (0)
            `;
        }
    }
}

        function renderCartPage() {
            const cartContent = document.getElementById('cartContent');
            
            if (cart.length === 0) {
                cartContent.innerHTML = `
                    <div class="text-center py-12">
                        <h3 class="text-xl font-bold text-gray-600 mb-2">Keranjang Kosong</h3>
                        <p class="text-gray-500 mb-6">Belum ada produk di keranjang Anda</p>
                        <button onclick="showPage('home')" class="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700">
                            Shopping
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
                            <span class="font-medium text-gray-700">All Selected(${cart.length} item)</span>
                        </label>
                        <span class="text-sm text-gray-500">Total Semua: $${totalAllItems.toFixed(2)}</span>
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
                                    <p class="text-gray-600">$${item.price}</p>
                                </div>
                                
                                <!-- Quantity Controls -->
                                <div class="flex items-center space-x-3">
                                    <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})"
                                            class="bg-gray-200 text-gray-700 w-7 h-7 rounded-full hover:bg-gray-300 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 448 512" fill="currentColor">
                                            <path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"/>
                                        </svg>
                                    </button>
                                    <span class="w-8 text-center font-medium">${item.quantity}</span>
                                    <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})"
                                            class="bg-gray-200 text-gray-700 w-7 h-7 rounded-full hover:bg-gray-300 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 448 512" fill="currentColor">
                                            <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0 32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/>
                                        </svg>
                                    </button>
                                </div>
                                
                                <!-- Price and Delete -->
                                <div class="text-right">
                                    <p class="font-bold text-lg">$${(item.price * item.quantity).toFixed(2)}</p>
                                    <button onclick="removeFromCart(${item.id})" 
                                            class="text-red-600 hover:text-red-800 text-sm mr-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 448 512" fill="currentColor">
                                            <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/>
                                        </svg>
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
                            <span id="selectedItemsCounter">${selectedItems.length} for ${cart.length} item selected</span>
                            </div>
                            <div class="text-right">
                                <p class="text-sm text-gray-600">Total selected:</p>
                                <span id="selectedTotal" class="text-2xl font-bold text-orange-600">$${selectedTotal.toFixed(2)}</span>
                            </div>
                        </div>
                        <button id="checkoutButton" 
                                onclick="proceedToCheckout()" 
                                ${selectedItems.length === 0 ? 'disabled' : ''}
                                class="w-full py-3 px-6 rounded-lg transition-colors ${selectedItems.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white">
                            <i class="fas fa-credit-card mr-2"></i>Checkout Item selected (${selectedItems.length})
                        </button>
                    </div>
                </div>
            `;

            // Update checkbox states after rendering
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
                showToast('Select minim 1 product', 'error');
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
    selectedItems = [productId]; // Auto-select the item for immediate checkout
    proceedToCheckout();
}

        function renderCheckoutPage() {
            const checkoutSummary = document.getElementById('checkoutSummary');
            
            // Only process selected items
            const selectedCartItems = cart.filter(item => selectedItems.includes(item.id));
            const total = selectedCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const shippingCost = 10;
            const grandTotal = total + shippingCost;

            checkoutSummary.innerHTML = `
                <div class="space-y-4">
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                        <p class="text-sm text-blue-800">
                            <i class="fas fa-info-circle mr-1"></i>
                            Checkout ${selectedCartItems.length} selected item
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
                            <span class="font-medium">$${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    `).join('')}
                    
                    <div class="space-y-2 pt-4">
                        <div class="flex justify-between">
                            <span>Subtotal:</span>
                            <span>$${total.toFixed(2)}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Delivery:</span>
                            <span>$${shippingCost.toFixed(2)}</span>
                        </div>
                        <div class="flex justify-between font-bold text-lg border-t pt-2">
                            <span>Total:</span>
                            <span class="text-orange-600">$${grandTotal.toFixed(2)}</span>
                        </div>
                    </div>
                    
                    <button onclick="processOrder()" 
                            class="w-full bg-orange-600 text-white py-3 px-6 rounded-lg hover:bg-orange-700 transition-colors mt-6">
                        <svg class="mr-2 inline-block" width="16" height="16" viewBox="0 0 512 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M173.9 439.4l-166.4-166.4c-10-10-10-26.2 0-36.2l36.2-36.2c10-10 26.2-10 36.2 0L192 312.7 432.1 72.6c10-10 26.2-10 36.2 0l36.2 36.2c10 10 10 26.2 0 36.2L210.1 439.4c-10 10-26.2 10-36.2 0z"/>
                        </svg>Buat Pesanan
                    </button>
                </div>
            `;
        }

        function processOrder() {
            const form = document.getElementById('checkoutForm');
            const formData = new FormData(form);
            
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            // Only process selected items
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
            
            // Remove selected items from cart
            cart = cart.filter(item => !selectedItems.includes(item.id));
            selectedItems = [];
            
            updateCartBadge();
            saveOrderData();
            saveCartData();

            showToast('Pesanan berhasil dibuat!');
            showPage('profile');
        }

        // Profile and Order Functions
       function renderProfilePage() {
    if (!currentUser) {
        document.getElementById('profilePage').innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-user-circle text-6xl text-gray-300 mb-4"></i>
                <h3 class="text-xl font-bold text-gray-600 mb-2">Belum Login</h3>
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

    profileInfo.innerHTML = `
        <div class="text-center mb-6">
            <div class="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-user text-orange-600 text-2xl"></i>
            </div>
            <h3 class="text-xl font-bold text-gray-800">${currentUser.name}</h3>
            <p class="text-gray-600">${currentUser.email}</p>
            <button onclick="showEditProfile()" class="mt-3 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 text-sm">
                <i class="fas fa-edit mr-2"></i>Edit Profile
            </button>
        </div>
        <div class="space-y-4">
            <div class="flex justify-between py-2 border-b">
                <span class="text-gray-600">order total:</span>
                <span class="font-medium">${orders.length}</span>
            </div>
            <div class="flex justify-between py-2 border-b">
                <span class="text-gray-600">member since:</span>
                <span class="font-medium">${new Date(currentUser.joinDate).toLocaleDateString('id-ID')}</span>
            </div>
        </div>
    `;

    if (orders.length === 0) {
        orderHistory.innerHTML = `
            <div class="text-center py-8">
                <i class="fas fa-receipt text-4xl text-gray-300 mb-4"></i>
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
                                <p class="text-sm text-gray-600">${new Date(order.date).toLocaleDateString('id-ID')}</p>
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
                            ${order.items.length > 2 ? `<p class="text-sm text-gray-600">+${order.items.length - 2} item lainnya</p>` : ''}
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

        function viewOrderDetail(orderId) {
            const order = orders.find(o => o.id === orderId);
            if (order) {
                alert(`order details #${order.id}\n\nStatus: ${order.status}\nTotal: ${order.total.toFixed(2)}\nTanggal: ${new Date(order.date).toLocaleDateString('id-ID')}`);
            }
        }

        // Authentication Functions
        function showLoginModal() {
    document.getElementById('loginModal').classList.remove('hidden');
    // Clear previous error messages
    clearLoginErrors();
}

        function closeLoginModal() {
    document.getElementById('loginModal').classList.add('hidden');
    // Clear form data
    document.getElementById('loginForm').reset();
    clearLoginErrors();
}

function clearLoginErrors() {
    const errorElements = document.querySelectorAll('.login-error');
    errorElements.forEach(el => el.remove());
}

function showLoginError(message) {
    // Remove existing error
    clearLoginErrors();
    
    // Create error element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'login-error bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4';
    errorDiv.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-exclamation-circle mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Insert error message at the top of the form
    const loginForm = document.getElementById('loginForm');
    loginForm.insertBefore(errorDiv, loginForm.firstChild);
}

        function showRegisterForm() {
    // Create a proper register modal instead of using prompts
    const registerModalHTML = `
        <div id="registerModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                <div class="p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-xl font-bold text-gray-800">Register Account</h2>
                        <button onclick="closeRegisterModal()" class="text-gray-400 hover:text-gray-600">
                            <i class="fas fa-times text-xl"></i>
                        </button>
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
                            <i class="fas fa-user-plus mr-2"></i>Register
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
    
    // Remove existing register modal if any
    const existingModal = document.getElementById('registerModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add to body
    document.body.insertAdjacentHTML('beforeend', registerModalHTML);
    
    // Hide login modal
    closeLoginModal();
    
    // Setup register form handler
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
    // Remove existing error
    const existingError = document.querySelector('#registerModal .register-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Create error element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'register-error bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4';
    errorDiv.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-exclamation-circle mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Insert error message at the top of the form
    const registerForm = document.getElementById('registerForm');
    registerForm.insertBefore(errorDiv, registerForm.firstChild);
}

function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validation
    if (!name) {
        showRegisterError('Name is required');
        return;
    }
    
    if (name.length < 2) {
        showRegisterError('Name must be at least 2 characters long');
        return;
    }
    
    if (!email) {
        showRegisterError('Email is required');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showRegisterError('Please enter a valid email address');
        return;
    }
    
    if (!password) {
        showRegisterError('Password is required');
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
    
    // Check if user already exists (simulate checking database)
    const existingUsers = JSON.parse(localStorage.getItem('jeansyshop_users') || '[]');
    const userExists = existingUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
    
    if (userExists) {
        showRegisterError('An account with this email already exists');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password, // In real app, this should be hashed
        joinDate: new Date().toISOString()
    };
    
    // Save to users array
    existingUsers.push(newUser);
    localStorage.setItem('jeansyshop_users', JSON.stringify(existingUsers));
    
    // Set as current user
    localStorage.setItem('modernshop_user', JSON.stringify(newUser));
    currentUser = newUser;
    
    // Update UI
    updateAuthUI();
    updateCartBadge();
    closeRegisterModal();
    showToast('Registration successful! Welcome to JeansyShop!');
}

        function login(email, password) {
    // Input validation
    if (!email || !password) {
        showLoginError('Email and password are required');
        return;
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showLoginError('Please enter a valid email address');
        return;
    }
    
    // Get registered users
    const registeredUsers = JSON.parse(localStorage.getItem('jeansyshop_users') || '[]');
    
    // Find user with matching credentials
    const user = registeredUsers.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    
    if (!user) {
        showLoginError('Invalid email or password. Please check your credentials and try again.');
        return;
    }
    
    // Login successful
    localStorage.setItem('modernshop_user', JSON.stringify(user));
    currentUser = user;
    updateAuthUI();
    updateCartBadge();
    closeLoginModal();
    showToast(`Welcome back, ${user.name}!`);
}

        function logout() {
    currentUser = null;
    localStorage.removeItem('modernshop_user');
    updateAuthUI();
    updateCartBadge(); // Tambahkan ini untuk hide cart badge setelah logout
    showToast('Logout berhasil!');
    if (currentPage === 'profile') {
        showPage('home');
    }
}

        function updateAuthUI() {
            const loginBtn = document.getElementById('loginBtn');
            const logoutBtn = document.getElementById('logoutBtn');
            
            if (currentUser) {
                loginBtn.classList.add('hidden');
                logoutBtn.classList.remove('hidden');
                logoutBtn.textContent = `Logout (${currentUser.name})`;
            } else {
                loginBtn.classList.remove('hidden');
                logoutBtn.classList.add('hidden');
            }
        }

        function showEditProfile() {
    document.getElementById('editProfileModal').classList.remove('hidden');
    document.getElementById('editName').value = currentUser.name;
    document.getElementById('editEmail').value = currentUser.email;
}

function closeEditProfile() {
    document.getElementById('editProfileModal').classList.add('hidden');
}

function saveProfile() {
    const newName = document.getElementById('editName').value.trim();
    const newEmail = document.getElementById('editEmail').value.trim();
    
    if (!newName || !newEmail) {
        showToast('Nama dan email tidak boleh kosong!', 'error');
        return;
    }
    
    // Validasi email sederhana
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
        showToast('Format email tidak valid!', 'error');
        return;
    }
    
    // Update currentUser
    currentUser.name = newName;
    currentUser.email = newEmail;
    
    // Simpan ke localStorage
    localStorage.setItem('modernshop_user', JSON.stringify(currentUser));
    
    // Update UI
    updateAuthUI();
    renderProfilePage();
    closeEditProfile();
    
    showToast('Profile berhasil diperbarui!');
}
        // Cart page function
        function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    
    // Add search on Enter key
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch(e);
        }
    });
    
    // Sort functionality
    const sortSelect = document.getElementById('sortSelect');
    sortSelect.addEventListener('change', handleSort);
    
    // Login form
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', handleLogin);
    
    // Checkout form
    const checkoutForm = document.getElementById('checkoutForm');
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        processOrder();
    });
}

// Cart Page
function showCartPage() {
    if (!currentUser) {
        showToast('Please log in first to access the basket', 'error');
        showLoginModal();
        return;
    }
    showPage('cart');
}

        function handleSearch(e) {
            const query = e.target.value.toLowerCase().trim();
            
            if (query === '') {
                // Show all products when search is empty
                if (currentPage === 'home') {
                    renderProductsGrid(products);
                } else if (currentPage === 'categoryProducts') {
                    // Re-render current category products
                    showCategoryProducts(currentCategory.slug);
                }
                return;
            }
            
            // Filter products based on search query
            let productsToFilter = products;
            
            // If we're on category page, filter only category products
            if (currentPage === 'categoryProducts') {
                productsToFilter = products.filter(p => p.category === currentCategory.slug);
            }
            
            const filteredProducts = productsToFilter.filter(product => 
                product.title.toLowerCase().includes(query) ||
                product.description.toLowerCase().includes(query) ||
                product.category.toLowerCase().includes(query) ||
                (product.brand && product.brand.toLowerCase().includes(query))
            );
            
            // Determine which grid to update
            const gridId = currentPage === 'categoryProducts' ? 'categoryProductsGrid' : 'productsGrid';
            renderProductsGrid(filteredProducts, gridId);
            
            // Show search results count
            const resultCount = filteredProducts.length;
            showSearchResults(query, resultCount);
        }

        function showSearchResults(query, count) {
            // Remove existing search results info
            const existingInfo = document.querySelector('.search-results-info');
            if (existingInfo) {
                existingInfo.remove();
            }
            
            // Add search results info
            const searchInfo = document.createElement('div');
            searchInfo.className = 'search-results-info bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6';
            searchInfo.innerHTML = `
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-orange-800">
                            <i class="fas fa-search mr-2"></i>
                            Menampilkan ${count} hasil untuk "${query}"
                        </p>
                    </div>
                    <button onclick="clearSearch()" class="text-orange-600 hover:text-orange-800 text-sm">
                        <i class="fas fa-times mr-1"></i>Hapus pencarian
                    </button>
                </div>
            `;
            
            // Insert after the page title/header
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
            searchInput.value = '';
            
            // Remove search results info
            const existingInfo = document.querySelector('.search-results-info');
            if (existingInfo) {
                existingInfo.remove();
            }
            
            // Re-render appropriate products
            if (currentPage === 'home') {
                renderProductsGrid(products);
            } else if (currentPage === 'categoryProducts') {
                showCategoryProducts(currentCategory.slug);
            }
        }

        function handleSort(e) {
            const sortBy = e.target.value;
            const searchQuery = document.getElementById('searchInput').value.toLowerCase().trim();
            
            // Get current products to sort
            let productsToSort = products;
            
            // If there's a search query, filter first
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
                // If on category page without search, get category products
                productsToSort = products.filter(p => p.category === currentCategory.slug);
            }
            
            // Sort the products
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
                    // Keep original order
                    break;
            }
            
            // Render sorted products
            const gridId = currentPage === 'categoryProducts' ? 'categoryProductsGrid' : 'productsGrid';
            renderProductsGrid(sortedProducts, gridId);
        }

        function handleLogin(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
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
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

        // Data Persistence Functions
        function saveCartData() {
            localStorage.setItem('modernshop_cart', JSON.stringify(cart));
        }

        function saveOrderData() {
            localStorage.setItem('modernshop_orders', JSON.stringify(orders));
        }

        function loadUserData() {
            // Load user
            const savedUser = localStorage.getItem('modernshop_user');
            if (savedUser) {
                currentUser = JSON.parse(savedUser);
                updateAuthUI();
            }
            
            // Load cart
            const savedCart = localStorage.getItem('modernshop_cart');
            if (savedCart) {
                cart = JSON.parse(savedCart);
                updateCartBadge();
            }
            
            // Load orders
            const savedOrders = localStorage.getItem('modernshop_orders');
            if (savedOrders) {
                orders = JSON.parse(savedOrders);
            }
        }

        // Demo function to create some test users (call this once to setup test data)
function setupTestUsers() {
    const testUsers = [
        {
            id: 1,
            name: 'Faiha',
            email: 'faiha@example.com',
            password: '123456',
            joinDate: new Date().toISOString()
        },
        {
            id: 2,
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password',
            joinDate: new Date().toISOString()
        }
    ];
    
    localStorage.setItem('jeansyshop_users', JSON.stringify(testUsers));
    console.log('Test users created:', testUsers);
}

// Uncomment the line below to create test users
// setupTestUsers();