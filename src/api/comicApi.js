import { axiosClient, axiosInstance } from "./config";
import getData from "./getData";

const BASE_URL_API = '/comic';

// comicApi
export async function getComic(url) {
    return await axiosClient.get(`${BASE_URL_API}/${url}`);
}

export async function getComics(params) {
    const res = await axiosClient.get(`${BASE_URL_API}/`, { params: params });
    return getData(res);
}

export async function searchComics(params) {
    const res = await axiosClient.get(`${BASE_URL_API}/search`, { params: params });
    return getData(res);
}

export async function getComicsByUploaderId(userId) {
    return await axiosClient.get(`${BASE_URL_API}/uploader/${userId}`);
}

export async function getDetailComic(url) {
    return await axiosClient.get(`${BASE_URL_API}/${url}`);
}

export async function createComic(params, user, dispatch, stateSuccess) {
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return await axi.post(`${BASE_URL_API}`, params);
}

export async function updateComic(params, user, dispatch, stateSuccess) {
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return await axi.put(`${BASE_URL_API}/${params.url}`, params);
}

export async function deleteComic(url, user, dispatch, stateSuccess) {
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return await axi.delete(`${BASE_URL_API}/${url}`);
}




// othersApi
export async function incrementViews(url) {
    return await axiosClient.patch(`${BASE_URL_API}/${url}/increment-views`);
}

export async function updateComicStatus(comicId, status, user, dispatch, stateSuccess) {

    if (!comicId || typeof comicId !== 'string') {
        throw new Error(`Invalid comicId: ${comicId}`);
    }
    if (!user?.accessToken) {
        throw new Error('No access token provided');
    }

    const axi = axiosInstance(user, dispatch, stateSuccess);
    const response = await axi.put(
        `/comic/${comicId}/status`,
        { status },
        {
            headers: { Authorization: `Bearer ${user.accessToken}` }
        }
    );

    return response.data;
}