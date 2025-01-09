import axios from "axios";
import { apiOptions, uiOptions } from "./options";
import type { AxiosInstance } from "axios";

export const apiClient: AxiosInstance = axios.create(apiOptions);
export const uiClient: AxiosInstance = axios.create(uiOptions);
