import { axiosClient, axiosInstance } from "./config";
import getData from "./getData";

const BASE_URL_API = '/readings';

// export async function setReading(params, user, dispatch, stateSuccess) {
//     const url = `/novels/novel/reading`;
//     let axi = axiosInstance(user, dispatch, stateSuccess);
//     return (await axi.post(`${BASE_URL_API}/readings`, params)).data;
// }
    
export async function getReading(url, user, dispatch, stateSuccess) {
        let axi = axiosInstance(user, dispatch, stateSuccess);
        return (await axi.get(`${BASE_URL_API}/${url}`));
}

export async function getReadings(user, dispatch, stateSuccess) {
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return await axi.get(`${BASE_URL_API}`, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
    });
}
