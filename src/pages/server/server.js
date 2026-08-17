import axios from "axios"


// BASE_URL = "10.113.144.60";

const api = axios.create({
    baseURL: `http://10.199.191.60:8000`,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
  },
})

export default api;