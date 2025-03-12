import { axiosClient, axiosInstance } from "./config";
import getData from "./getData";

const BASE_URL_API = '/comic';

// comicApi
export async function getComics(params) {
    const res = await axiosClient.get(`${BASE_URL_API}/`, { params: params });
    return getData(res);
}

export async function searchComics(params) {
    const res = await axiosClient.get(`${BASE_URL_API}/search`, { params: params });
    return getData(res);
}

export async function getComicsByUsername(params) {
    const res = await axiosClient.get(`${BASE_URL_API}/created`, { params: params });
    return getData(res);
}

export async function getDetailComic(url) {
    return await axiosClient.get(`${BASE_URL_API}/${url}`);
}

// chapterApi
export async function getChapters(url, params) {
    return await axiosClient.get(`${BASE_URL_API}/${url}/chapters`, { params: params});
}

export async function getChapter(url, chapterNumber) {
    return await axiosClient.get(`${BASE_URL_API}/${url}/chapters/${chapterNumber}`);
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


// othersApi
export async function incrementViews(url) {
    return await axiosClient.patch(`${BASE_URL_API}/${url}/increment-views`);
}