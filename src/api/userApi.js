import { axiosClient, axiosInstance } from "./config";
import getData from "./getData";

const BASE_URL_API = '/user';

export async function getUserById(userId, user, dispatch, stateSuccess) {
    const axi = axiosInstance(user, dispatch, stateSuccess);
    return await axi.get(`${BASE_URL_API}/${userId}`);
}

export async function updateUserInfo(userId, formData, user, dispatch, stateSuccess, params) {
    const axi = axiosInstance(user, dispatch, stateSuccess);
    return await axi.put(`${BASE_URL_API}/${userId}`, formData, {
            headers: { Authorization: `Bearer ${user.accessToken}` },
        }
    );
}