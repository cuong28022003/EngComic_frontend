
// src/api/rank.js
import { axiosInstance } from "./config";

const BASE_URL_API = '/rank';

export const rankApi = {
  // Lấy rank dựa trên XP
  getRankByXp: async (xp, user, dispatch, stateSuccess) => {
    try {
      const axi = axiosInstance(user, dispatch, stateSuccess);
      const response = await axi.get(`${BASE_URL_API}/${xp}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Lấy tất cả ranks
  getAllRanks: async (user, dispatch, stateSuccess) => {
    try {
      const axi = axiosInstance(user, dispatch, stateSuccess);
      const response = await axi.get(BASE_URL_API);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Lấy rank bằng ID
  getRankById: async (id, user, dispatch, stateSuccess) => {
    try {
      const axi = axiosInstance(user, dispatch, stateSuccess);
      const response = await axi.get(`${BASE_URL_API}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Tạo mới rank
  createRank: async (rankData, user, dispatch, stateSuccess) => {
    try {
      const { name, minXp, maxXp, badge } = rankData;
      const axi = axiosInstance(user, dispatch, stateSuccess);
      
      const formData = new FormData();
      formData.append('name', name);
      formData.append('minXp', minXp);
      formData.append('maxXp', maxXp);
      formData.append('badge', badge);

      const response = await axi.post(BASE_URL_API, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Cập nhật rank
  updateRank: async (id, rankData, user, dispatch, stateSuccess) => {
    try {
      const { name, minXp, maxXp, badge } = rankData;
      const axi = axiosInstance(user, dispatch, stateSuccess);
      
      const formData = new FormData();
      formData.append('name', name);
      formData.append('minXp', minXp);
      formData.append('maxXp', maxXp);
      if (badge) formData.append('badge', badge);

      const response = await axi.put(`${BASE_URL_API}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Xóa rank
  deleteRank: async (id, user, dispatch, stateSuccess) => {
    try {
      const axi = axiosInstance(user, dispatch, stateSuccess);
      const response = await axi.delete(`${BASE_URL_API}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  }
};

