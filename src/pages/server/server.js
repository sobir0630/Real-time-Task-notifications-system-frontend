import axios from "axios"


// BASE_URL = "10.113.144.60";

const api = axios.create({
    baseURL: `http://16.171.212.228:8000`,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
  },
})

export default api;