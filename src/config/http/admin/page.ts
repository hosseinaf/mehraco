import axios, { AxiosResponse } from "axios";
 
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const client = axios.create({
  baseURL: apiUrl,
  timeout: 30000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "X-Client-Name": "site",
  },
});

 

export default client;

