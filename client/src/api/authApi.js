import axios from "axios";
import { use } from "react";

const API = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api/auth`,
});

export const loginUser = userData => API.post("/login", userData);
export const registerUser = userData => API.post("/register",userData);