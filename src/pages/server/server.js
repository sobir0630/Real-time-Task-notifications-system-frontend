import axios from "axios"


// BASE_URL = "10.113.144.60";

const api = axios.create({
    baseURL: `http://127.0.0.1:8000`,
    // baseURL: `https://idiom-princess-catnap.ngrok-free.dev`,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "ngrok-skip-browser-warning": "true",
  },
})

export default api;