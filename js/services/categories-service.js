let categoryService;

class CategoryService {

    getAllCategories(callback)
    {
        const url = `${config.baseUrl}/categories`;

        let isLoaded = false;

        // Set a timeout that will check for success after a delay to prevent premature error
        const timeout = setTimeout(() => {
            if (!isLoaded) {
                const data = {
                    error: "Loading categories failed."
                };
                templateBuilder.append("error", data, "errors");
            }
        }, 500);

        return axios.get(url)
            .then(response => {
                // If the request is successful, stop the timeout
                clearTimeout(timeout);

                isLoaded = true;
                callback(response.data);
            })
            .catch(error => {
                // If there was an error, show the error message after the timeout
                if (!isLoaded) {
                    const data = {
                        error: "Loading categories failed."
                    };
                    templateBuilder.append("error", data, "errors");
                }
            });
    }

    // Used to load the selected category to the editing form
        editCategory(categoryId)
            {
                const url = `${config.baseUrl}/categories/${categoryId}`;

                axios.get(url)
                     .then(response => {
                         templateBuilder.build("edit-category-form", response.data, "main")
                     })
                     .catch(error => {
                         const data = {
                             error: "Loading category failed."
                         };

                         templateBuilder.append("error", data, "errors")
                     })
            }

        // Used to submit the updated category from the editing form
        updateCategory(categoryId, category) {
            const url = `${config.baseUrl}/categories/${categoryId}`;

            axios.put(url, category, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(() => {
                const data = {
                    message: "The category has been updated."
                };
                templateBuilder.append("message", data, "errors");
            })
            .catch(error => {
                const data = {
                    error: "Category update failed."
                };
                templateBuilder.append("error", data, "errors");
            });
        }

        deleteCategory(categoryId) {
                const url = `${config.baseUrl}/categories/${categoryId}`;

                axios.delete(url)
                    .then(response => {
                    const data = {
                        message: "The category has been deleted."
                    };
                    templateBuilder.append("message", data, "errors");
                    loadHome();
                })
                .catch(error => {
                    const data = {
                        error: "Deleting category failed."
                    };

                        templateBuilder.append("error", data, "errors")
                    })
                }



}

document.addEventListener('DOMContentLoaded', () => {
    categoryService = new CategoryService();
});
