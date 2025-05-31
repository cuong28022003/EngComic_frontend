import { axiosClient, axiosInstance } from "./config";
import getData from "./getData";

const BASE_URL_API = '/saved';

export async function saveComic(data, user, dispatch, stateSuccess) {
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return await axi.post(`${BASE_URL_API}`, data);
}

export async function unsaveComic(savedId, user, dispatch, stateSuccess) {
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return await axi.delete(`${BASE_URL_API}/${savedId}`);
}

export async function checkSavedComic(params, user, dispatch, stateSuccess) {
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return await axi.get(`${BASE_URL_API}/check`, { params });
}

export async function getSavedComics(userId, user, dispatch, stateSuccess) {
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return getData(await axi.get(`${BASE_URL_API}/user/${userId}`));
}