import axios from "axios";
import server from "../environment.js";

const client = axios.create({
  baseURL: `${server}/`,
  // withCredentials: true, // Enable if needed for cookies/session
});

export default client;
