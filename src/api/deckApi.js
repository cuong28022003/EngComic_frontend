import { axiosClient, axiosInstance } from "./config";

const BASE_URL_API = '/deck';

export async function getDecksByUserId(userId, user, dispatch, stateSuccess) {
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return await axi.get(`${BASE_URL_API}/user/${userId}`);
}

export async function getDeckById(id, user, dispatch, stateSuccess) {
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return await axi.get(`${BASE_URL_API}/${id}`);
}

export async function createDeck(data, user, dispatch, stateSuccess) {
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return await axi.post(`${BASE_URL_API}`, data);
}

export async function updateDeckById(id, data, user, dispatch, stateSuccess) {
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return await axi.put(`${BASE_URL_API}/${id}`, data);
}

export async function deleteDeckById(id, user, dispatch, stateSuccess) {
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return await axi.delete(`${BASE_URL_API}/${id}`);
}