import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const client = axios.create({
  baseURL: apiUrl,
  timeout: 30000,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

export default client;

