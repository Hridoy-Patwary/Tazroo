class ApiService {
    constructor() {
        this.baseURL = process.env.REACT_APP_API_URL;
    }

    /**
     * Handles GET requests
     * @param {string} endpoint - The API endpoint
     * @param {Object} params - Query parameters to be added to the URL
     * @returns {Promise<Object>} - The response data
     */
    async get(endpoint, params = {}) {
        try {
            const url = new URL(`${this.baseURL}${endpoint}`);
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("GET Request Error:", error);
            throw new Error("Failed to fetch data");
        }
    }

    /**
     * Handles POST requests
     * @param {string} endpoint - The API endpoint
     * @param {Object} data - The data to be sent in the request body
     * @returns {Promise<Object>} - The response data
     */
    async post(endpoint, data) {
        try {
            const uri = `${this.baseURL}${endpoint}`;
            const jsonString = JSON.stringify(data);

            const response = await fetch(uri, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: jsonString,
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.log("POST Request Error:", error);
        }
    }
}

// Create an instance of the ApiService class with your backend API URL
const apiService = new ApiService();

export default apiService;