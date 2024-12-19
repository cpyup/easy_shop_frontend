let categoryService;

class CategoryService {

    getAllCategories(callback)
        {
            const url = `${config.baseUrl}/categories`;
            return axios.get(url)
                .then(response => {
                    callback(response.data);
                })
                .catch(error => {
                    const data = {
                        error: "Loading categories failed."
                    };
                    templateBuilder.append("error", data, "errors")
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

            addCategory(category)
            {
                const url = `${config.baseUrl}/categories`;

                            axios.post(url, category, {
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            })
                            .then(() => {
                                const data = {
                                    message: "The category has been added."
                                };
                                templateBuilder.append("message", data, "errors");
                            })
                            .catch(error => {
                                const data = {
                                    error: "Adding category failed."
                                };
                                templateBuilder.append("error", data, "errors");
                            });
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
