import { axiosClient, axiosInstance } from "./config";
import getData from "./getData";

const BASE_URL_API = '/character';

//return list of characters
export async function getAllCharactersByUserId(userId, user, dispatch, stateSuccess) {
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return await axi.get(`${BASE_URL_API}/user/${userId}/all`);
}

export async function getCharactersByUserId(userId, params, user, dispatch, stateSuccess) {
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return await axi.get(`${BASE_URL_API}/user/${userId}`, { params: params });
}

export async function getCharactersByVersion(versionId) {
    return await axiosClient.get(`${BASE_URL_API}/version/${versionId}`);
}   