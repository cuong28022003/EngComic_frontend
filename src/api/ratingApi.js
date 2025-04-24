import { axiosClient, axiosInstance } from "./config";
import getData from "./getData";

const BASE_URL_API = '/rating';

export async function getComicRating(params, user, dispatch, stateSuccess) {
    const url = `/comics/${params.url}/rating`;
    let axi = axiosInstance(user, dispatch, stateSuccess);
    const res = await axi.post(url);
    return res.data;
}

export async function rateComic(params, user, dispatch, stateSuccess) {
        const url = `/comics/${params.url}/rate`
        let axi = axiosInstance(user, dispatch, stateSuccess);
        const res = await axi.post(url, { rating: params.rating });
        return res.data;
    }
export async function deleteComicRating(params, user, dispatch, stateSuccess) {
            const url = `/comics/${params.url}/rating`;
            let axi = axiosInstance(user, dispatch, stateSuccess);
            return await axi.delete(url);
}
        
export async function getRatingsByComicId(comicId) {
    return await axiosClient.get(`${BASE_URL_API}/comic/${comicId}`);
}

export async function submitRating(params, user, dispatch, stateSuccess) {
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return await axi.post(`${BASE_URL_API}`, params);
}

export async function getSummaryRating(comicId) {
    return await axiosClient.get(`${BASE_URL_API}/summary/${comicId}`);
}