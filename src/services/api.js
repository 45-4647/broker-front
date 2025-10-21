import axios from "axios";

const API = axios.create({ baseURL: `https://broker-back.onrender.com/api` });
export default API;
