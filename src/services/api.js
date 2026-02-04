import axios from "axios";

const API = axios.create({ baseURL: `https://broker-backend-greq.onrender.com/api` });
export default API;
