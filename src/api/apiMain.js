import { logoutSuccess } from "../redux/slice/auth";
import ChangePassword from "../views/Account/ChangePassword";
import { axiosClient, axiosInstance } from "./config";
import getData from "./getData";

const apiMain = {
  ///Comment
  createComment: async (user, params, dispatch, stateSuccess) => {
    const url = `/comment`;
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return getData(await axi.post(url, params));
  },
  getCommentsByUrl: async (params) => {
    const url = `/comment/${params.url}`;
    return getData(await axiosClient.get(url));
  },
  deleteComment: async (params, user, dispatch, stateSuccess) => {
    const url = `/comment/${params.id}`;
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return getData(await axi.delete(url));
  },

  ///user
  getAllUser: async (user, dispatch, stateSuccess) => {
    const url = "admin/users";
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return getData(
      await axi.get(url, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      })
    );
  },
  refreshToken: async (user) => {
    const params = { refreshToken: user.refreshToken };
    const res = await axiosClient.post("/auth/refreshtoken", params, {
      headers: { Authorization: `Bearer ${user.accessToken}` },
    });
    return res.data;
  },
  getUserInfo: async (user, dispatch, stateSuccess) => {
    const axi = await axiosInstance(user, dispatch, stateSuccess);
    return await axi.get("/user/info", {
      headers: { Authorization: `Bearer ${user.accessToken}` },
    });
  },
  ChangePassword: async (user, dispatch, stateSuccess, params) => {
    const axi = await axiosInstance(user, dispatch, stateSuccess);
    return getData(
      await axi.put("/user/info/password", params, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      })
    );
  },
  activeAccount: async (params) => {
    const res = await axiosClient.get(`/auth/active`, { params: params });
    return res.data;
  },
  activeByAdmin: async (user, dispatch, stateSuccess, params) => {
    const axi = await axiosInstance(user, dispatch, stateSuccess);
    return getData(await axi.put(`/admin/user/active`, params));
  },
  inactiveByAdmin: async (user, dispatch, stateSuccess, params) => {
    const axi = await axiosInstance(user, dispatch, stateSuccess);
    return getData(await axi.put(`/admin/user/inactive`, params));
  },
  updateRole: async (user, dispatch, stateSuccess, params) => {
    const axi = await axiosInstance(user, dispatch, stateSuccess);
    return getData(await axi.put("/admin/role/updatetouser", params));
  },
  deleteAccount: async (user, dispatch, stateSuccess, params) => {
    const axi = await axiosInstance(user, dispatch, stateSuccess);
    const deleteUserRequest = {
      username: params.id,
    };
    return getData(
      await axi.delete(`/admin/deleteuser`, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
        data: deleteUserRequest,
      })
    );
  },

  ///comics
  getAllComics: async (user, dispatch, stateSuccess) => {
    const axi = axiosInstance(user, dispatch, stateSuccess);
    try {
      const response = await axi.get("/admin/comics", {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching comics:", error);
      throw error;
    }
  },
  updateComicStatus: async (comicId, status, user, dispatch, stateSuccess) => {

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
  },
  ///report
  createReport: async (user, params, dispatch, stateSuccess) => {
    const url = "/report";
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return getData(await axi.post(url, params, {
      headers: { Authorization: `Bearer ${user.accessToken}` }
    }));
  },
  getAllReports: async (user, dispatch, stateSuccess, page = 0, size = 10) => {
    const url = `/report/all?page=${page}&size=${size}`;
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return getData(await axi.get(url, {
      headers: { Authorization: `Bearer ${user.accessToken}` }
    }));
  },
  getReportsByComic: async (comicId, user, dispatch, stateSuccess) => {
    const url = `/report/comic/${comicId}`;
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return getData(await axi.get(url, {
      headers: { Authorization: `Bearer ${user.accessToken}` }
    }));
  },
  updateReportStatus: async (reportId, status, user, dispatch, stateSuccess) => {
    const url = `/report/${reportId}/status?status=${status}`;
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return getData(await axi.put(url, null, {
      headers: { Authorization: `Bearer ${user.accessToken}` }
    }));
  },
  getReportSummary: async (comicId, user, dispatch, stateSuccess) => {
    const url = `/report/summary/${comicId}`;
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return getData(await axi.get(url, {
      headers: { Authorization: `Bearer ${user.accessToken}` }
    }));
  },
  getReportsByStatus: async (status, user, dispatch, stateSuccess) => {
    const url = `/report/status?status=${status}`;
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return getData(await axi.get(url, {
      headers: { Authorization: `Bearer ${user.accessToken}` }
    }));
  },
};

export default apiMain;