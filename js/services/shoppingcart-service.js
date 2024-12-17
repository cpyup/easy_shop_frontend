let cartService;

class ShoppingCartService {

    cart = {
        items:[],
        total:0
    };

    addToCart(productId)
    {
        const url = `${config.baseUrl}/cart/products/${productId}`;
        // const headers = userService.getHeaders();

        axios.post(url, {})// ,{headers})
            .then(response => {
                this.setCart(response.data)

                this.updateCartDisplay()

            })
            .catch(error => {

                const data = {
                    error: "Add to cart failed."
                };

                templateBuilder.append("error", data, "errors")
            })
    }

    setCart(data)
    {
        this.cart = {
            items: [],
            total: 0
        }

        this.cart.total = data.total;

        for (const [key, value] of Object.entries(data.items)) {
            this.cart.items.push(value);
        }
    }

    loadCart()
    {

        const url = `${config.baseUrl}/cart`;

        axios.get(url)
            .then(response => {
                this.setCart(response.data)

                this.updateCartDisplay()

            })
            .catch(error => {

                const data = {
                    error: "Load cart failed."
                };

                templateBuilder.append("error", data, "errors")
            })

    }

    loadCartPage() {
        const main = document.getElementById("main");
        main.innerHTML = "";  // Clear the main container

        let div = document.createElement("div");
        div.classList = "filter-box";
        main.appendChild(div);

        const contentDiv = document.createElement("div");
        contentDiv.id = "content";
        contentDiv.classList.add("content-form");

        const cartHeader = document.createElement("div");
        cartHeader.classList.add("cart-header");

        const h1 = document.createElement("h1");
        h1.innerText = "Cart";
        cartHeader.appendChild(h1);

        const cartButtons = document.createElement("div");
        cartButtons.id = "cart-buttons";
        cartButtons.classList.add("cart-buttons");

        // Create the "Clear Cart" button
        const clearCartButton = document.createElement("button");
        clearCartButton.classList.add("btn");
        clearCartButton.classList.add("btn-danger");
        clearCartButton.innerText = "Clear";
        clearCartButton.addEventListener("click", () => this.clearCart());
        cartButtons.appendChild(clearCartButton);

        // Create the "Checkout" button
        const checkoutCartButton = document.createElement("button");
        checkoutCartButton.classList.add("btn");
        checkoutCartButton.classList.add("btn-primary");
        checkoutCartButton.innerText = "Checkout";
        checkoutCartButton.addEventListener("click", () => showCheckoutForm());
        cartButtons.appendChild(checkoutCartButton);



        contentDiv.appendChild(cartButtons);
        main.appendChild(contentDiv);

        // Check if the cart has items
        if (this.cart.items && Object.keys(this.cart.items).length > 0) {
            // Cart is not empty, populate with items
            this.cart.items.forEach(item => {
                this.buildItem(item, contentDiv);  // Build each item in the cart
            });
        } else {
            // Cart is empty, show a message
            const emptyMessage = document.createElement("div");
            emptyMessage.classList.add("empty-cart-message");
            emptyMessage.innerHTML = "<p>Your cart is empty.</p>";
            contentDiv.appendChild(emptyMessage);

            // Hide the "Clear Cart" button since the cart is empty
            button.style.display = "none";
        }
    }


    buildItem(item, parent)
    {
        let outerDiv = document.createElement("div");
        outerDiv.classList.add("cart-item");

        let div = document.createElement("div");
        outerDiv.appendChild(div);
        let h4 = document.createElement("h4")
        h4.innerText = item.product.name;
        div.appendChild(h4);

        let photoDiv = document.createElement("div");
        photoDiv.classList.add("photo")
        let img = document.createElement("img");
        img.src = `/images/products/${item.product.imageUrl}`
        img.addEventListener("click", () => {
            showImageDetailForm(item.product.name, img.src)
        })
        photoDiv.appendChild(img)
        let priceH4 = document.createElement("h4");
        priceH4.classList.add("price");
        priceH4.innerText = `$${item.product.price}`;
        photoDiv.appendChild(priceH4);
        outerDiv.appendChild(photoDiv);

        let descriptionDiv = document.createElement("div");
        descriptionDiv.innerText = item.product.description;
        outerDiv.appendChild(descriptionDiv);

        let quantityDiv = document.createElement("div")
        quantityDiv.innerText = `Quantity: ${item.quantity}`;
        outerDiv.appendChild(quantityDiv)


        parent.appendChild(outerDiv);
    }

    clearCart()
    {

        const url = `${config.baseUrl}/cart`;

        axios.delete(url)
             .then(response => {
                 this.cart = {
                     items: [],
                     total: 0
                 }

                 this.cart.total = response.data.total;

                 for (const [key, value] of Object.entries(response.data.items)) {
                     this.cart.items.push(value);
                 }

                 this.updateCartDisplay()
                 this.loadCartPage()

             })
             .catch(error => {

                 const data = {
                     error: "Empty cart failed."
                 };

                 templateBuilder.append("error", data, "errors")
             })
    }

    updateCartDisplay()
    {
        try {
            let totalQuantity = 0;

            for(let itemId in this.cart.items){
                totalQuantity += this.cart.items[itemId].quantity;
            }

            const cartControl = document.getElementById("cart-items")
            cartControl.innerText = totalQuantity;
        }
        catch (e) {
            console.error("Error updating cart count:",e);
        }
    }
}





document.addEventListener('DOMContentLoaded', () => {
    cartService = new ShoppingCartService();

    if(userService.isLoggedIn())
    {
        cartService.loadCart();
    }

});
