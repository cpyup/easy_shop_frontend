function showCheckoutForm()
{
    templateBuilder.build('checkout-form',{},'login');
}

function showRegisterForm()
{
    templateBuilder.build('register-form', {}, 'login');
}


function showLoginForm() {
    templateBuilder.build('login-form', {}, 'login', setupEnterKeyListener);
}

// This function will be called after the form is loaded.
function setupEnterKeyListener() {
    // Find all modal dialogs
    const modals = document.querySelectorAll('.modal');

    modals.forEach(modal => {
        const loginButton = modal.querySelector('.btn.btn-primary');

        // Add event listener to capture the Enter key press inside each modal
        modal.addEventListener("keydown", function(event) {
            if (event.key === "Enter") {
                event.preventDefault(); // Prevent form submission to avoid page reload
                if (loginButton) {
                    loginButton.click(); // Trigger the click on the primary button
                }
            }
        });
    });
}


function hideModalForm()
{
    templateBuilder.clear('login');
}

function register()
{
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const confirmPass = document.getElementById("confirm-password").value;

    userService.register(username,password,confirmPass);
    hideModalForm();


}

function login()
{
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    userService.login(username, password);
    hideModalForm()
}

function showImageDetailForm(product, imageUrl)
{
    const imageDetail = {
        name: product,
        imageUrl: imageUrl
    };

    templateBuilder.build('image-detail',imageDetail,'login')
}

function loadHome()
{
    templateBuilder.build('home',{},'main')

    productService.search();
    categoryService.getAllCategories(loadCategories);
}

function editProfile()
{
    profileService.loadProfile();
}

function saveProfile()
{
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const address = document.getElementById("address").value;
    const city = document.getElementById("city").value;
    const state = document.getElementById("state").value;
    const zip = document.getElementById("zip").value;

    const profile = {
        firstName,
        lastName,
        phone,
        email,
        address,
        city,
        state,
        zip
    };

    profileService.updateProfile(profile);
}

function saveProduct()
{
        const productId = parseInt(document.getElementById("productId").value);
        const name = document.getElementById("productName").value;
        const price = parseInt(document.getElementById("price").value);
        const categoryId = parseInt(document.getElementById("categoryId").value);
        const description = document.getElementById("description").value;
        const color = document.getElementById("color").value;
        const imageUrl = document.getElementById("imageUrl").value;
        const stock = parseInt(document.getElementById("stock").value);
        const featured = document.getElementById("featured").checked;

        const product = {
            name,
            price,
            categoryId,
            description,
            color,
            stock,
            imageUrl,
            featured
        };

        productService.updateProduct(productId,product);
}

function deleteProduct()
{
    const productId = parseInt(document.getElementById("productId").value);
    productService.deleteProduct(productId);
}

function showCart()
{
    cartService.loadCartPage();
}

function clearCart()
{
    cartService.clearCart();
    cartService.loadCartPage();
}

function setCategory(control)
{
    productService.addCategoryFilter(control.value);
    productService.search();

}

function setColor(control)
{
    productService.addColorFilter(control.value);
    productService.search();

}

function setMinPrice(control)
{
    // const slider = document.getElementById("min-price");
    const label = document.getElementById("min-price-display")
    label.innerText = control.value;

    const value = control.value != 0 ? control.value : "";
    productService.addMinPriceFilter(value)
    productService.search();

}

function setMaxPrice(control)
{
    // const slider = document.getElementById("min-price");
    const label = document.getElementById("max-price-display")
    label.innerText = control.value;

    const value = control.value != 1500 ? control.value : "";
    productService.addMaxPriceFilter(value)
    productService.search();

}

function closeError(control)
{
    setTimeout(() => {
        control.click();
    },3000);
}

document.addEventListener('DOMContentLoaded', () => {
    loadHome();

});
