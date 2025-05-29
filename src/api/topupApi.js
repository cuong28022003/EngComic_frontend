import { axiosClient, axiosInstance } from "./config";

const BASE_URL_API = '/topup';

export async function getTopupHistory(params, user, dispatch, stateSuccess) {
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return await axi.get(`${BASE_URL_API}/history`, { params });
}

export async function createTopupRequest(data, user, dispatch, stateSuccess) {
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return await axi.post(BASE_URL_API, data);
}

export async function cancelTopupRequest(requestId, user, dispatch, stateSuccess) {
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return await axi.post(`${BASE_URL_API}/${requestId}/cancel`);
}