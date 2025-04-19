function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    localStorage.setItem("cartCount", cart.length); // Store count in localStorage
  }
function renderCart() {
    const cartDiv = document.getElementById('cart');
    const cart1Div = document.getElementById('cart1'); // Get the new cart1 element
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cartDiv.innerHTML = '';
    cart1Div.innerHTML = ''; // Clear the cart1 div
    let totalPrice = 0; // Initialize total price

    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
    
        // Add item price to total price
        totalPrice += item.price;
       // Dynamically display the image without path adjustment
       const imgPath = item.img; // No path adjustment here
    
        cartItem.innerHTML = `
            <img src="${imgPath}" alt="${item.name}">
            <div id="description-box1">
                <div><h2>${item.name}</h2></div>
                <div><h2>Size: ${item.size}</h2></div>
                <div><h2>Price: Rs${item.price}</h2></div>
                <div><h2>Product Code: ${item.productCode}</h2></div>
            </div>
            <button onclick="removeFromCart(${index})"><h2>X</h2></button>
        `;
        cartDiv.appendChild(cartItem);
    });
    updateCartCount(); // Update cart count here



///////////////////////////////////
///////////////////////////////////
///////////////////////////////////
///////////////////////////////////
///////////////////////////////////
///////////////////////////////////
///////////////////////////////////
 // Create a total price div
    const totalDiv = document.createElement('div');
    totalDiv.className = 'total-price';
    
    let discount = 0;
    let discountText = 'Discount'; // Default text is 'Discount'
    let deliveryFee = 70; // Default delivery fee is Rs 70
    let deliveryFeeText = 'Rs 70'; // Default delivery fee text
    
    // Apply discount based on total price
    if (totalPrice >= 2599 && totalPrice <= 4999) {
        discount = 300; // Flat 300 discount
        discountText = 'Flat Rs 300 Discount'; // Change text to "Flat Rs 300 Discount"
    } else if (totalPrice > 4999) {
        discount = totalPrice * 0.1; // 10% discount
        discount = Math.floor(discount); // Ensure discount is a whole number (rounded down)
        discountText = 'Discount 10%'; // Change text to "Discount 10%"
    }

    // If the total price is over Rs 1699, delivery is free
    if (totalPrice > 1699) {
        deliveryFee = 0; // Set delivery fee to Rs 0
        deliveryFeeText = '<h2>Free</h2>'; // Text for free delivery
    }

    // Final total after applying discount and delivery fee
    const finalPrice = totalPrice - discount + deliveryFee;

    totalDiv.innerHTML = `
        <div id="Order-Summery"> 
            <h2>Order Summary</h2>
        </div>
        <div id="order-price"> 
            <div id="order-price1"><h2>Sub-Total</h2></div>
            <div id="order-price2"><h2>: Rs${totalPrice}</h2></div>
        </div>
        <div id="order-price-discount"> 
            <div id="order-price-discount-left"><h2>${discountText}</h2></div>
            <div id="order-price-discount-right"><h2>: Rs${discount}</h2></div>
        </div>
        <!-- Delivery fee showing 70 with a crossed sign when delivery is free -->
        <div id="order-price-delivery">  
            <div id="order-price-delivery-left"><h2>Delivery</h2></div>
            <div id="order-price-delivery-right">
                ${deliveryFee === 0 ? `<h2 style="text-decoration: line-through;">Rs 70</h2>` : `<h2>:Rs 70</h2>`} 
           
            </div>
        </div>
            <div id="order-price-discount1">  </div>
            <div id="order-price-discount1">  </div>
            <div id="order-price-discount1">  </div>
        <div id="final-order-price"> 
            <div id="final-order-price1"><h2>Total</h2></div>
            <div id="final-order-price2"><h2>: Rs${finalPrice}</h2></div>
        </div>
        <div id="after-order-buttons">
          <button id="checkout" onclick="checkout()"><h1>Checkout</h1></button>
           <button id="shopping" onclick="goToProducts()"> <h2>Continue Shop</h2></button>
          </div>
    `;
    cart1Div.appendChild(totalDiv); // Add total price to cart1Div
}


///////////////////////////////////
///////////////////////////////////
//  to delete 


function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount(); // Ensure cart count updates when an item is removed
    renderCart();
}





function goToProducts() {
    window.location.href = 'http://127.0.0.1:5501/clothing/html/landingpage.html';
}

// Initial render of the cart
renderCart();


function checkout() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert("Your cart is empty!");
    } else {
        // Ask for confirmation
        const confirmed = confirm("Do you want to proceed to checkout?");
        if (confirmed) {
            showCheckoutForm();
        }
    }
}
///////////////////////////////////
///////////////////////////////////
///////////////////////////////////
///////////////////////////////////
///////////////////////////////////
// DETAILS FORM
function showCheckoutForm() {
    // Get the checkout overlay and form container
    const overlay = document.getElementById('checkout-overlay');
    const formContainer = document.getElementById('checkout-form-container');

    // Create the form content
    formContainer.innerHTML = `
       
        <form id="checkoutForm" onsubmit="submitForm(event)">
     
            <div id="placeorder">
        
                <h1>Order Details</h1>
                  <div id="close-button" onclick="closeCheckoutForm()">X</div>
            </div>
            <div class="details">
                <label for="name">Name:</label><br>
                <input  type="text" id="name" required><br><br>
            </div>
            <div class="details">
                <label for="name">Phone no:</label><br>
                <input  type="number" id="number" required><br><br>
            </div>
            <div class="details">
                <label for="email">Email:</label><br>
                <input  type="email" id="email" required><br><br>
            </div>
            <div class="details1">
                <label for="address">Address:</label><br>
                <textarea id="address" required></textarea><br><br>
            </div>



            <div class="details2">
                <div class="state-city">
                    <div class="details">
                        <label id="label1" for="name">State:</label><br>
                        <input id="state" type="text"  required><br><br>
                    </div>
                </div>
                <div class="state-city">
                    <div class="details">
                        <label id="label1" for="name">City:</label><br>
                        <input id="city" type="text" required><br><br>
                    </div>
                </div>
                <div class="state-city">
                    <div class="details">
                        <label id="label1" for="name">Pin code:</label><br>
                        <input id="pin" type="text"  required><br><br>
                    </div>
                </div>
            </div>



            <div class="details">
                <label for="name">Landmark:</label><br>
                <input id="landmark" type="text"  required><br><br>
            </div>






             <!-- Notification Section with Terms and Conditions -->
            <div class="notification-section">
                <h2>Important Information</h2>
                <h4>Please record a video while opening your parcel. This helps us verify any damage, stains, broken tags, or other issues with the product and ensures quick resolution if needed.</h4>
                <h4>Please record a video while opening your parcel. This helps us verify any damage, stains, or issues with the product. Do not break any tags, as once broken, the dress will not be replaceable.</h4>
               
                <label>
                    <input type="checkbox" id="agreeCheckbox" required>
                    I have read and agree to the Terms and Conditions
                </label>
            </div>
            <div class="details3">
                <button id="submit" type="submit"><h1>Place Order</h1></button>
            </div>
        </form>
    `;

    // Show the overlay
    overlay.classList.add('active');
}










function submitForm(event) {
    event.preventDefault();

    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    const cartItems = cart.map(item => ({
        productCode: item.productCode,
        size: item.size
    }));

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('number').value.trim();
    const email = document.getElementById('email').value.trim();
    const addressText = document.getElementById('address').value.trim();
    const state = document.getElementById('state').value.trim();
    const city = document.getElementById('city').value.trim();
    const pin = document.getElementById('pin').value.trim();
    const landmark = document.getElementById('landmark').value.trim();

    if (!name || !phone || !email || !addressText || !state || !city || !pin || !landmark) {
        alert('Please fill all address fields');
        return;
    }

    const address = {
        name,
        phone,
        email,
        address: addressText,
        state,
        city,
        pin,
        landmark
    };

    const payload = {
        cart: cartItems,
        address: address
    };

    fetch('http://localhost:3000/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(res => {
        if (!res.ok) throw new Error('Server error');
        return res.json();
    })
    .then(data => {
        if (data.success) {
            showOrderConfirmation(data);
            document.getElementById('checkoutForm').reset();
        } else {
            alert('Order failed: ' + (data.message || 'Unknown error'));
        }
    })
    .catch(err => {
        alert('Something went wrong, please try again');
        console.error(err);
    });
}

function showOrderConfirmation(orderData) {
    const popup = document.getElementById('orderConfirmationPopup');
    const orderItemsContainer = document.getElementById('orderItems');
    orderItemsContainer.innerHTML = '';

    const { cart, address, pricing, hash } = orderData.order;

    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.style.cssText = 'display: flex; margin-bottom: 10px; padding: 10px; border: 1px solid #eee; border-radius: 4px;';
        itemElement.innerHTML = ` 
            <img src="${item.imageUrl || 'placeholder.jpg'}" alt="${item.productName}" style="width: 60px; height: 80px; object-fit: contain; margin-right: 15px;">
            <div style="flex-grow: 1;">
                <div style="font-weight: bold; margin-bottom: 5px;">${item.productName}</div>
                <div>Product Code: ${item.productCode}</div>
                <div>Size: ${item.size}</div>
                <div>Price: ₹${item.price.toFixed(2)}</div>
            </div>
        `;
        orderItemsContainer.appendChild(itemElement);
    });

    const shippingAddressElement = document.getElementById('shippingAddress');
    shippingAddressElement.innerHTML = `
        <p>${address.name}</p>
        <p>${address.address}</p>
        <p>${address.city}, ${address.state} - ${address.pin}</p>
        <p>Landmark: ${address.landmark || 'N/A'}</p>
        <p>Phone: ${address.phone}</p>
        <p>Email: ${address.email}</p>
    `;

    document.getElementById('subtotal').textContent = `₹${pricing.subtotal.toFixed(2)}`;
    document.getElementById('discount').textContent = `₹${pricing.discount.toFixed(2)}`;
    document.getElementById('delivery').textContent = pricing.delivery === 0 ? 'FREE' : `₹${pricing.delivery.toFixed(2)}`;
    document.getElementById('total').textContent = `₹${pricing.total.toFixed(2)}`;

    // Save full order details with hash for verification during final submit
    const fullOrder = {
        cart,
        address,
        pricing,
        hash
    };
    localStorage.setItem('finalOrder', JSON.stringify(fullOrder));

    // Change button behavior to "Place Order"
    const placeBtn = document.getElementById('continueShoppingBtn');
    placeBtn.textContent = 'Place Order';
    placeBtn.onclick = () => finalizeOrder(orderData); // Pass orderData to finalizeOrder

    popup.style.display = 'flex';
    document.getElementById('closePopup').onclick = () => popup.style.display = 'none';
    popup.onclick = e => {
        if (e.target === popup) popup.style.display = 'none';
    };
}

function finalizeOrder(orderData) {
    // We are getting order details from the pop-up, not from anywhere else
    const finalOrder = {
        cart: orderData.order.cart,
        address: orderData.order.address,
        pricing: orderData.order.pricing,
        hash: orderData.order.hash
    };

    fetch('http://localhost:3000/api/verify-and-save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalOrder)
    })
    .then(res => {
        if (!res.ok) throw new Error('Server error');
        return res.json();
    })
    .then(data => {
        if (data.success) {
            alert('Order placed successfully!');
            localStorage.removeItem('cart');
            localStorage.removeItem('finalOrder');
            document.getElementById('orderConfirmationPopup').style.display = 'none';
        } else {
            alert('Order verification failed: ' + (data.message || 'Invalid hash'));
        }
    })
    .catch(err => {
        alert('Error placing order');
        console.error(err);
    });
}
