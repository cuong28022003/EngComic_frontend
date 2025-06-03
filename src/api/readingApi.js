import { axiosClient, axiosInstance } from "./config";
import getData from "./getData";

const BASE_URL_API = '/reading';

export async function setReading(data, user, dispatch, stateSuccess) {
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return await axi.post(`${BASE_URL_API}`, data);
}

export async function getReadingByUserIdAndComicId(params, user, dispatch, stateSuccess) {
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return await axi.get(`${BASE_URL_API}`, { params });
}

export async function getReadingsByUserId(userId, params, user, dispatch, stateSuccess) {
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return await axi.get(`${BASE_URL_API}/user/${userId}`, { params });
}

