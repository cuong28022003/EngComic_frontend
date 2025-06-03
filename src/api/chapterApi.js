import { axiosClient, axiosInstance } from "./config";
import getData from "./getData";

const BASE_URL_API = '/chapter';

// chapterApi
export async function getChaptersByComicId(comicId, params) {
    return await axiosClient.get(`${BASE_URL_API}/comic/${comicId}`, { params: params });
}

export async function getChapterByComicIdAndChapterNumber(params) {
    return await axiosClient.get(`${BASE_URL_API}`, { params: params });
}

export async function getChapterById(chapterId) {
    return await axiosClient.get(`${BASE_URL_API}/${chapterId}`);
}

export async function createChapter(formData, user, dispatch, stateSuccess) {
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return await axi.post(`${BASE_URL_API}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
}

export async function updateChapter(chapterId, formData, user, dispatch, stateSuccess) {
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return await axi.put(`${BASE_URL_API}/${chapterId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
}

export async function deleteChapterById(chapterId, user, dispatch, stateSuccess) {
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return await axi.delete(`${BASE_URL_API}/${chapterId}`);
}
