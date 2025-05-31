import { axiosClient, axiosInstance } from "./config";
import getData from "./getData";

const BASE_URL_API = '/reading';

export async function setReading(params, user, dispatch, stateSuccess) {
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return await axi.post(`${BASE_URL_API}`, params);
}
    
export async function getReading(url, user, dispatch, stateSuccess) {
        let axi = axiosInstance(user, dispatch, stateSuccess);
        return (await axi.get(`${BASE_URL_API}/${url}`));
}

export async function getReadings(params, user, dispatch, stateSuccess) {
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return await axi.get(`${BASE_URL_API}`, {params},{
        headers: { Authorization: `Bearer ${user.accessToken}` },
    });
}
