import { axiosClient, axiosInstance} from "./config";
import getData from "./getData";

const BASE_URL_API = '/auth';

export async function login(params) {
    const res = await axiosClient.post(`${BASE_URL_API}/login`, params);
    return res.data;
}

export async function register(params) {
    const res = await axiosClient.post(`${BASE_URL_API}/register`, params);
    return res.data;
}

export async function forgetPassword(params) {
    const res = await axiosClient.post(`${BASE_URL_API}/forgetpassword`, params);
    return getData(res);
}

export async function reActive(params) {
    const res = await axiosClient.post(`${BASE_URL_API}/reactive`, params);
    return getData(res);
}

export async function verifyToken(user, dispatch, stateSuccess) {
    const url = `${ BASE_URL_API }/verifytoken`;
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return (
        await axi.get(url, {
            headers: { Authorization: `Bearer ${user.accessToken}` },
        })
    ).data;
}

export async function checkUsername(params) {
    const res = await axiosClient.get(`${BASE_URL_API}/checkusername`, {
        params: params,
    });
    return getData(res);
}

export async function checkEmail(params) {
    const res = await axiosClient.get(`${BASE_URL_API}/checkemail`, { params: params });
    return getData(res);
}