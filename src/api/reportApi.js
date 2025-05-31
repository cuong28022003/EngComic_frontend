import { axiosClient, axiosInstance } from "./config";
import getData from "./getData";

const BASE_URL_API = '/report';

export async function createReport(data, user, dispatch, stateSuccess) {
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return await axi.post(`${BASE_URL_API}`, data);
}

export async function getAllReports(user, dispatch, stateSuccess, page = 0, size = 10) {
    const url = `/report/all?page=${page}&size=${size}`;
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return getData(await axi.get(url, {
        headers: { Authorization: `Bearer ${user.accessToken}` }
    }));
}

export async function getReportsByComic(comicId, user, dispatch, stateSuccess) {
    const url = `/report/comic/${comicId}`;
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return getData(await axi.get(url, {
        headers: { Authorization: `Bearer ${user.accessToken}` }
    }));
}

export async function updateReportStatus(reportId, status, user, dispatch, stateSuccess) {
    const url = `/report/${reportId}/status?status=${status}`;
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return getData(await axi.put(url, null, {
        headers: { Authorization: `Bearer ${user.accessToken}` }
    }));
}

export async function getReportSummary(comicId, user, dispatch, stateSuccess) {
    const url = `/report/summary/${comicId}`;
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return getData(await axi.get(url, {
        headers: { Authorization: `Bearer ${user.accessToken}` }
    }));
}

export async function getReportsByStatus(status, user, dispatch, stateSuccess) {
    const url = `/report/status?status=${status}`;
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return getData(await axi.get(url, {
        headers: { Authorization: `Bearer ${user.accessToken}` }
    }));
}