import { axiosClient, axiosInstance } from "./config";

const BASE_URL_API = '/card';


export async function getCardsByDeckId(deckId, user, dispatch, stateSuccess) {
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return await axi.get(`${BASE_URL_API}/deck/${deckId}`);
}

export async function getCardById(id, user, dispatch, stateSuccess) {
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return await axi.get(`${BASE_URL_API}/${id}`);
}

export async function createCard(data, user, dispatch, stateSuccess) {
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return await axi.post(`${BASE_URL_API}`, data);
}

export async function updateCardById(id, data, user, dispatch, stateSuccess) {
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return await axi.put(`${BASE_URL_API}/${id}`, data);
}

export async function deleteCardById(id, user, dispatch, stateSuccess) {
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return await axi.delete(`${BASE_URL_API}/${id}`);
}

export async function reviewCard(data, user, dispatch, stateSuccess) {
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return await axi.post(`${BASE_URL_API}/review`, data);
}