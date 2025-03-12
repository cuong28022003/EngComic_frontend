import { logoutSuccess } from "../redux/slice/auth";
import ChangePassword from "../views/Account/ChangePassword";
import { axiosClient, axiosInstance } from "./config";
import getData from "./getData";
const apiMain = {




 
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
  deleteComic: async (params, user, dispatch, stateSuccess) => {
    const url = `/novels/novel/${params.url}`;
    let axi = axiosInstance(user, dispatch, stateSuccess);
    return await axi.delete(url);
  },
  // saveComic: async (data, user, dispatch, stateSuccess) => {
  //   const url = `/saved/`;
  //   let axi = axiosInstance(user, dispatch, stateSuccess);
  //   return await axi.post(url, data);
  // },
  // unsaveComic: async (data, user, dispatch, stateSuccess) => {
  //   const url = `/saved/`;
  //   let axi = axiosInstance(user, dispatch, stateSuccess);
  //   return await axi.delete(url, { data: data });
  // },
  // checkSavedComic: async (params, user, dispatch, stateSuccess) => {
  //   let axi = axiosInstance(user, dispatch, stateSuccess);
  //   return getData(await axi.get(`/saved/${params.url}`));
  // },
  // getSavedComics: async (user, dispatch, stateSuccess) => {
  //   const url = `/saved/savedbyuser`;
  //   let axi = axiosInstance(user, dispatch, stateSuccess);
  //   return getData(await axi.get(url));
  // },

  

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
    //return getData(await axi.put(`/auth/activebyadmin`, params));
    return getData(await axi.put(`/admin/user/active`, params));

  },
  inactiveByAdmin: async (user, dispatch, stateSuccess, params) => {
    const axi = await axiosInstance(user, dispatch, stateSuccess);
    //return getData(await axi.put(`/auth/inactivebyadmin`, params));
    return getData(await axi.put(`/admin/user/inactive`, params));

  },
  updateRole: async (user, dispatch, stateSuccess, params) => {
    const axi = await axiosInstance(user, dispatch, stateSuccess);
    return getData(await axi.put("/admin/role/updatetouser", params));
  },
  deleteAccount: async (user, dispatch, stateSuccess, params) => {
    const axi = await axiosInstance(user, dispatch, stateSuccess);

    const deleteUserRequest = {
      username: params.id, // Giả sử params.id là username
    };

    return getData(
      await axi.delete(`/admin/deleteuser`, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
        data: deleteUserRequest, // Gửi dữ liệu ở đây
      })
    );
  },

  //s
  getAllComics: async (user, dispatch, stateSuccess) => {
    const axi = axiosInstance(user, dispatch, stateSuccess); // Sử dụng instance đã được cấu hình

    try {
      // Thêm token vào headers của yêu cầu
      const response = await axi.get("/admin/comics", {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      });
      return response.data; // Trả về data
    } catch (error) {
      console.error("Error fetching comics:", error);
      throw error; // Ném lỗi để xử lý ở phía gọi hàm
    }
  },

  //e




};
export default apiMain;
