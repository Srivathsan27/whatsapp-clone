import axios from "axios";

export const API_URL = "http://localhost:5000";
export const axiosInstance = axios.create({ withCredentials: true });
