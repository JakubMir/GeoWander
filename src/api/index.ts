import Config from "@/config";
import axios from "axios";

export const api = axios.create({
    baseURL: Config.apiUrl,
});

export const setBearerAuthToken = (token: string | undefined) => {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};
