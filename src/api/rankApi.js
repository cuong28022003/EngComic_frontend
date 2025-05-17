import { axiosClient, axiosInstance } from "./config";
import getData from "./getData";

const BASE_URL_API = '/rank';

export async function getAllRanks() {
    return await axiosClient.get(`${BASE_URL_API}/`);
}