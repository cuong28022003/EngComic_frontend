import { axiosClient, axiosInstance } from "./config";
import getData from "./getData";

const BASE_URL_API = '/user';

export async function updateUserInfo(user, dispatch, stateSuccess, params) {
    const axi = axiosInstance(user, dispatch, stateSuccess);
    return await axi.put(`${BASE_URL_API}/${user.username}`, params, {
            headers: { Authorization: `Bearer ${user.accessToken}` },
        }
    );
}