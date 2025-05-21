import { axiosClient, axiosInstance } from "./config";
import getData from "./getData";

const BASE_URL_API = '/character-usage';

export async function checkCanUseSkill(payload, user, dispatch, stateSuccess) {
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return await axi.post(`${BASE_URL_API}/can-use`, payload);
}

export async function markSkillUsed(payload, user, dispatch, stateSuccess) {
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return await axi.post(`${BASE_URL_API}/use`, payload);
}

export async function checkAndUseSkill(payload, user, dispatch, stateSuccess) {
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return await axi.post(`${BASE_URL_API}/use-skill`, payload);
}