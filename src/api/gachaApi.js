import { axiosClient, axiosInstance } from "./config";

const BASE_URL_API = '/gacha';

export async function openGacha(payload, user, dispatch, stateSuccess) {
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return await axi.post(`${BASE_URL_API}/open`, payload);
}

export async function rollGacha(count) {
    return await axiosClient.post(`${BASE_URL_API}/roll`, null, { params: { count } });
}