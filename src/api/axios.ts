import axios from "axios";

export const api = axios.create({
  baseURL: "https://665de6d7e88051d60408c32d.mockapi.io",
  headers: { "Content-Type": "application/json" },
});
