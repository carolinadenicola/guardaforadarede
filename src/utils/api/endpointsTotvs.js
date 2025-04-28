require("dotenv").config();
import axios from "axios";

export const APITotvs = axios.create({
  baseURL: "https://aceschmersal162859.datasul.cloudtotvs.com.br/api/esp/v1",
  headers: {
    "Content-Type": "application/json",
  },
  auth: {
    username: process.env.NEXT_PUBLIC_USERNAME,
    password: process.env.NEXT_PUBLIC_PASSWORD,
  },
});
