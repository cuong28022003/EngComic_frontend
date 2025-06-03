import { axiosClient, axiosInstance } from "./config";

const BASE_URL_API = '/rank';

export async function getRankByXp(xp, user, dispatch, stateSuccess) {
  const axi = axiosInstance(user, dispatch, stateSuccess);
  return await axi.get(`${BASE_URL_API}/${xp}`);
}

export async function getAllRanks() {
  return await axiosClient.get(BASE_URL_API);
}

// Lấy rank bằng ID
export async function getRankById(id) {
  return await axiosClient.get(`${BASE_URL_API}/${id}`);
}

export async function createRank(formData, user, dispatch, stateSuccess) {
  const axi = axiosInstance(user, dispatch, stateSuccess);
  return await axi.post(BASE_URL_API, formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
}

export async function updateRank(id, formData, user, dispatch, stateSuccess) {
  const axi = axiosInstance(user, dispatch, stateSuccess);
  return await axi.put(`${BASE_URL_API}/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
}

// Xóa rank
export async function deleteRank(id, user, dispatch, stateSuccess) {
  const axi = axiosInstance(user, dispatch, stateSuccess);
  return await axi.delete(`${BASE_URL_API}/${id}`);
};

