import { axiosClient, axiosInstance } from "./config";
import getData from "./getData";

const BASE_URL_API = '/user-stats';

export async function getUserStats(userId, user, dispatch, stateSuccess) {
    const axi = axiosInstance(user, dispatch, stateSuccess);
    return await axi.get(`${BASE_URL_API}/${userId}`);
}

export async function addXp(payload, user, dispatch, stateSuccess) {
    const axi = axiosInstance(user, dispatch, stateSuccess);
    return await axi.post(`${BASE_URL_API}/add-xp`, payload);
}

export async function getLeaderboard(limit) {
    return await axiosClient.get(`${BASE_URL_API}/top-users`, { params: { limit } });
}

export async function addDiamondApi(payload, user, dispatch, stateSuccess) {
    const axi = axiosInstance(user, dispatch, stateSuccess);
    return await axi.post(`${BASE_URL_API}/add-diamond`, payload);
}

export async function upgradePremium(payload, user, dispatch, stateSuccess) {
    const axi = axiosInstance(user, dispatch, stateSuccess);
    return await axi.post(`${BASE_URL_API}/upgrade-premium`, payload);
}