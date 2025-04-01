import { axiosClient, axiosInstance } from "./config";
import getData from "./getData";

const BASE_URL_API = '/chapter';

// chapterApi
export async function getChapters(params) {
    return await axiosClient.get(`${BASE_URL_API}`, { params: params });
}

export async function getChapter(url, chapterNumber) {
    return await axiosClient.get(`${BASE_URL_API}/${url}/${chapterNumber}`);
}

export async function getChapterByNumber(
    tentruyen,
    chapnum,
    user,
    dispatch,
    stateSuccess
) {
    try {
        // Sử dụng axiosInstance nếu user đã đăng nhập
        if (user) {
            let axi = axiosInstance(user, dispatch, stateSuccess);
            const response = await axi.get(
                `/novels/novel/${tentruyen}/chuong/${chapnum}`
            );
            return getData(response);
        } else {
            // Sử dụng axiosClient nếu user chưa đăng nhập
            const response = await axiosClient.get(
                `/novels/novel/${tentruyen}/chuong/${chapnum}`
            );
            return getData(response);
        }
    } catch (error) {
        console.error("Error fetching chapter:", error);
        return { error: "Unable to fetch chapter data" }; // Xử lý lỗi
    }
}

export async function createChapter(data, user, dispatch, stateSuccess) {
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return await axi.post(`${BASE_URL_API}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
}

export async function updateChapter(data, user, dispatch, stateSuccess) {
    const url = `/novels/novel/chuong/edit`;
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return getData(await axi.put(url, data));
}

export async function deleteChapter(data, user, dispatch, stateSuccess) {
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return getData(await axi.delete(`${BASE_URL_API}`, { data }));
}
