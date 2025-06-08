import { axiosClient, axiosInstance } from "./config";

const BASE_URL_API = '/translator';

export async function translateText(data, user, dispatch, stateSuccess) {
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return await axi.post(`${BASE_URL_API}/ipa-meaning`, data);
}