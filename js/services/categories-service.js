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
        }, 3000);

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
}

document.addEventListener('DOMContentLoaded', () => {
    categoryService = new CategoryService();
});
