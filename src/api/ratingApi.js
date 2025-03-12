import { axiosClient, axiosInstance } from "./config";
import getData from "./getData";

const BASE_URL_API = '/ratings';

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