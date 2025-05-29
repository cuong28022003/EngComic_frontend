import { axiosClient, axiosInstance } from "./config";
import getData from "./getData";

const BASE_URL_API = '/user-character';

export async function createUserCharacter(data, user, dispatch, stateSuccess) {
    const axi = axiosInstance(user, dispatch, stateSuccess);
    return await axi.post(`${BASE_URL_API}`, data);
}