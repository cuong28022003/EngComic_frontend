
import { axiosClient, axiosInstance } from "./config";
import getData from "./getData";

const BASE_URL_API = '/characters';

//return list of characters
export async function getAllCharactersByUserId(userId, user, dispatch, stateSuccess) {
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return await axi.get(`${BASE_URL_API}/users/${userId}/all`);
}

export async function getCharactersByUserId(userId, params, user, dispatch, stateSuccess) {
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return await axi.get(`${BASE_URL_API}/users/${userId}`, { params: params });
}

export async function getCharactersByVersion(versionId) {
    return await axiosClient.get(`${BASE_URL_API}/version/${versionId}`);
}

// Lấy danh sách enemies ngẫu nhiên từ backend
export async function getRandomEnemies(count = 1, user, dispatch, stateSuccess) {
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return await axi.get(`${BASE_URL_API}/random-enemies`, { params: { count } });
}

export async function getCharacterById(characterId) {
    return await axiosClient.get(`${BASE_URL_API}/${characterId}`);
}