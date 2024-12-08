import { logoutSuccess } from "../redux/authSlice";
import ChangePassword from "../views/Account/ChangePassword";
import { axiosClient, axiosInstance } from "./axiosClient";
import getData from "./getData";
const apiMain = {
  ///authentication
  login: async (params) => {
    const res = await axiosClient.post("/auth/login", params);
    return res.data;
  },
  register: async (params) => {
    const res = await axiosClient.post("/auth/register", params);
    return res.data;
  },
  forgetPassword: async (params) => {
    const res = await axiosClient.post("/auth/forgetpassword", params);
    return getData(res);
  },
  reActive: async (params) => {
    const res = await axiosClient.post("/auth/reactive", params);
    return getData(res);
  },
  verifyToken: async (user, dispatch, stateSuccess) => {
    const url = `/auth/verifytoken`;
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return (
      await axi.get(url, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      })
    ).data;
  },
  checkUsername: async (params) => {
    const res = await axiosClient.get("/auth/checkusername", { params: params });
    return getData(res);
  },
  checkEmail: async (params) => {
    const res = await axiosClient.get("/auth/checkemail", { params: params });
    return getData(res);
  },

  ///get data

  getStorys: async (params) => {
    const res = await axiosClient.get(`/novels/`, { params: params });
    return getData(res);
  },
  getFilteredComics: async (params) => {
    const res = await axiosClient.get(`/novels/search`, { params: params });
    return getData(res);
  },
  getStorysByUsername: async (params) => {
    const res = await axiosClient.get(`/novels/created`, { params: params });
    return getData(res);
  },
  getComic: async (params) => {
    const res = await axiosClient.get(`/novels/novel/${params.url}`);
    return getData(res);
  },
  getChapters: async (url, params) => {
    const res = await axiosClient.get(`/novels/novel/${url}/chuong`, {
      params: params,
    });
    return getData(res);
  },
  getChapter: async (url, chapterNumber) => {
    try {
      const res = await axiosClient.get(`/novels/novel/${url}/chuong/${chapterNumber}`);
      return res.data;
    } catch (error) {
      console.error("Error fetching chapter:", error);
      throw error; // Ném lỗi ra để xử lý ở nơi gọi hàm
    }
  },
  getNameChapters: async (url, params) => {
    const res = await axiosClient.get(`/novels/novel/${url}/mucluc`, {
      params: params,
    });
    return getData(res);
  },
  incrementViews: async (url) => {
    const res = await axiosClient.patch(`/novels/increment-views/${url}`);
    return getData(res);
  },
  getChapterByNumber: async (
    tentruyen,
    chapnum,
    user,
    dispatch,
    stateSuccess
  ) => {
      try {
          // Sử dụng axiosInstance nếu user đã đăng nhập
          if (user) {
              let axi = axiosInstance(user, dispatch, stateSuccess);
              const response = await axi.get(`/novels/novel/${tentruyen}/chuong/${chapnum}`);
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
  },

  setReading: async (params, user, dispatch, stateSuccess) => {
    const url = `/novels/novel/reading`;
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return (await axi.post(url, params)).data;
  },
  getReading: async (params, user, dispatch, stateSuccess) => {
    const url = "/novels/reading";
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return (await axi.get(url, { params: params })).data;
  },
  createChapter: async (data, user, dispatch, stateSuccess) => {
    const url = `/novels/novel/chuong/create`;
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return getData(await axi.post(url, data));
  },
  updateChapter: async (data, user, dispatch, stateSuccess) => {
    const url = `/novels/novel/chuong/edit`;
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return getData(await axi.put(url, data));
  },

  deleteChapter: async (data, user, dispatch, stateSuccess) => {
    const url = `/novels/novel/chuong`;
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return getData(await axi.delete(url, { data }));
  },
  getReadings: async (user, dispatch, stateSuccess) => {
    const url = `/novels/readings`;
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return getData(
      await axi.get(url, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      })
    );
  },
  createComic: async (params, user, dispatch, stateSuccess) => {
    const url = `/novels/novel/create`;
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return (await axi.post(url, params)).data;
  },
  updateNovel: async (params, user, dispatch, stateSuccess) => {
    const url = `/novels/novel/edit`;
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return getData(await axi.put(url, params));
  },
  deleteNovel: async (params, user, dispatch, stateSuccess) => {
    const url = `/novels/novel/${params.url}`;
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return getData(await axi.delete(url));
  },
  saveComic: async (data, user, dispatch, stateSuccess) => {
    const url = `/saved/`;
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return await axi.post(url, data);
  },
  unsaveComic: async (data, user, dispatch, stateSuccess) => {
    const url = `/saved/`;
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return await axi.delete(url, { data: data });
  },
  checkSavedComic: async (params, user, dispatch, stateSuccess) => {
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return getData(await axi.get(`/saved/${params.url}`));
  },
  getSavedComics: async (user, dispatch, stateSuccess) => {
    const url = `/saved/savedbyuser`;
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return getData(await axi.get(url));
  },
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
    const url = "user/getusers";
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
  updateUserInfo: async (user, dispatch, stateSuccess, params) => {
    const axi = await axiosInstance(user, dispatch, stateSuccess);
    return getData(
      await axi.put("/user/info", params, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      })
    );
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
    return getData(await axi.put(`/auth/activebyadmin`, params));
  },
  inactiveByAdmin: async (user, dispatch, stateSuccess, params) => {
    const axi = await axiosInstance(user, dispatch, stateSuccess);
    return getData(await axi.put(`/auth/inactivebyadmin`, params));
  },
  updateRole: async (user, dispatch, stateSuccess, params) => {
    const axi = await axiosInstance(user, dispatch, stateSuccess);
    return getData(await axi.put("/user/updateroles", params));
  },
  deleteAccount: async (user, dispatch, stateSuccess, params) => {
    const axi = await axiosInstance(user, dispatch, stateSuccess);
    return getData(
      await axi.delete(`/user?id=${params.id}`, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      })
    );
  },
};
export default apiMain;
