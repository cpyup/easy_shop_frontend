let productService;

class ProductService {

    photos = [];


    filter = {
        cat: undefined,
        minPrice: undefined,
        maxPrice: undefined,
        color: undefined,
        queryString: () => {
            let qs = "";
            if(this.filter.cat){ qs = `cat=${this.filter.cat}`; }
            if(this.filter.minPrice)
            {
                const minP = `minPrice=${this.filter.minPrice}`;
                if(qs.length>0) {   qs += `&${minP}`; }
                else { qs = minP; }
            }
            if(this.filter.maxPrice)
            {
                const maxP = `maxPrice=${this.filter.maxPrice}`;
                if(qs.length>0) {   qs += `&${maxP}`; }
                else { qs = maxP; }
            }
            if(this.filter.color)
            {
                const col = `color=${this.filter.color}`;
                if(qs.length>0) {   qs += `&${col}`; }
                else { qs = col; }
            }

            return qs.length > 0 ? `?${qs}` : "";
        }
    }

    constructor() {

        //load list of photos into memory
        axios.get("/images/products/photos.json")
            .then(response => {
                this.photos = response.data;
            });
    }

    hasPhoto(photo){
        return this.photos.filter(p => p == photo).length > 0;
    }

    addCategoryFilter(cat)
    {
        if(cat == 0) this.clearCategoryFilter();
        else this.filter.cat = cat;
    }
    addMinPriceFilter(price)
    {
        if(price == 0 || price == "") this.clearMinPriceFilter();
        else this.filter.minPrice = price;
    }
    addMaxPriceFilter(price)
    {
        if(price == 0 || price == "") this.clearMaxPriceFilter();
        else this.filter.maxPrice = price;
    }
    addColorFilter(color)
    {
        if(color == "") this.clearColorFilter();
        else this.filter.color = color;
    }

    clearCategoryFilter()
    {
        this.filter.cat = undefined;
    }
    clearMinPriceFilter()
    {
        this.filter.minPrice = undefined;
    }
    clearMaxPriceFilter()
    {
        this.filter.maxPrice = undefined;
    }
    clearColorFilter()
    {
        this.filter.color = undefined;
    }

    getStockById(productId)
    {
        const url = `${config.baseUrl}/products/${productId}`;

        axios.get(url)
                     .then(response => {
                         return(response.data.stock);
                     })
                    .catch(error => {

                        const data = {
                            error: "Searching product failed."
                        };

                        templateBuilder.append("error", data, "errors")
                    });
    }

    search()
    {
        const url = `${config.baseUrl}/products${this.filter.queryString()}`;

        axios.get(url)
             .then(response => {
                 let data = {};
                 data.products = response.data;

                 data.products.forEach(product => {
                     if(!this.hasPhoto(product.imageUrl))
                     {
                         product.imageUrl = "no-image.jpg";
                     }
                 })

                 templateBuilder.build('product', data, 'content', this.enableButtons);

             })
            .catch(error => {

                const data = {
                    error: "Searching products failed."
                };

                templateBuilder.append("error", data, "errors")
            });
    }

    enableButtons()
    {
        const buttons = [...document.querySelectorAll(".add-button")];
        const adminButtons = [...document.querySelectorAll(".edit-button")];
        const stockValueElements = [...document.querySelectorAll(".stock-value")];


        if(userService.isLoggedIn())
        {
            buttons.forEach(button => {
                button.classList.remove("invisible");
            });

            if(userService.isAdmin())
            {
                adminButtons.forEach(button => {
                                button.classList.remove("invisible")
                            });
            }else{
                adminButtons.forEach(button => {
                                button.classList.add("invisible")
                            });
            }

            stockValueElements.forEach(element => {
                            const stockInt = parseInt(element.textContent.replace(/\D/g, ''));
                                if(stockInt === 0 || stockInt === null){
                                    element.textContent = 'Out of Stock';
                                }
                            });

        }
        else
        {
            buttons.forEach(button => {
                button.classList.add("invisible")
            });
        }
    }

    addProductForm()
    {
        templateBuilder.build("add-product-form", {}, "main");
    }

    addNewProduct(product)
    {
       const url = `${config.baseUrl}/products`;

               axios.post(url, product, {
                   headers: {
                       'Content-Type': 'application/json'
                   }
               })
               .then(() => {
                   const data = {
                       message: "New     product has been added."
                   };
                   templateBuilder.append("message", data, "errors");
               })
               .catch(error => {
                   const data = {
                       error: "Adding new product failed."
                   };
                   templateBuilder.append("error", data, "errors");
               });
    }

    // Used to load the selected product to the editing form
    editProduct(productId)
        {
            const url = `${config.baseUrl}/products/${productId}`;

            axios.get(url)
                 .then(response => {
                     templateBuilder.build("edit-product-form", response.data, "main")
                 })
                 .catch(error => {
                     const data = {
                         error: "Loading product failed."
                     };

                     templateBuilder.append("error", data, "errors")
                 })
        }

    // Used to submit the updated product from the editing form
    updateProduct(productId, product) {
        const url = `${config.baseUrl}/products/${productId}`;

        axios.put(url, product, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(() => {
            const data = {
                message: "The product has been updated."
            };
            templateBuilder.append("message", data, "errors");
        })
        .catch(error => {
            const data = {
                error: "Product update failed."
            };
            templateBuilder.append("error", data, "errors");
        });
    }

    deleteProduct(productId) {
            const url = `${config.baseUrl}/products/${productId}`;

            axios.delete(url)
                .then(response => {
                const data = {
                    message: "The product has been deleted."
                };
                templateBuilder.append("message", data, "errors");
                loadHome();
            })
            .catch(error => {
                const data = {
                    error: "Deleting product failed."
                };

                    templateBuilder.append("error", data, "errors")
                })
            }
}

document.addEventListener('DOMContentLoaded', () => {
    productService = new ProductService();

});
