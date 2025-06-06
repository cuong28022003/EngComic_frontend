import { axiosClient, axiosInstance } from "./config";
import getData from "./getData";

const BASE_URL_API = '/comic';

// comicApi
export async function getComicById(comicId) {
    return await axiosClient.get(`${BASE_URL_API}/${comicId}`);
}

export async function getComics(params) {
    return await axiosClient.get(`${BASE_URL_API}`, { params: params });
}

export async function searchComics(params) {
    return await axiosClient.get(`${BASE_URL_API}/search`, { params: params });
}

export async function getComicsByUploaderId(userId) {
    return await axiosClient.get(`${BASE_URL_API}/uploader/${userId}`);
}

export async function createComic(formData, user, dispatch, stateSuccess) {
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return await axi.post(`${BASE_URL_API}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
}

export async function updateComic(comicId, formData, user, dispatch, stateSuccess) {
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return await axi.put(`${BASE_URL_API}/${comicId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
}

export async function deleteComic(comicId, user, dispatch, stateSuccess) {
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return await axi.delete(`${BASE_URL_API}/${comicId}`);
}


// othersApi
export async function incrementViews(comicId) {
    return await axiosClient.patch(`${BASE_URL_API}/${comicId}/view`);
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