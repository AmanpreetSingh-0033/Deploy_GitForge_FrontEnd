import axios from "axios";
import server from "../environment.js";

const client = axios.create({
  baseURL: `${server}/`,
});

export default client;
