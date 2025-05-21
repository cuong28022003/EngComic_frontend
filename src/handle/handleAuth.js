import { loginStart, loginSuccess, loginFalse, logoutSuccess } from "../redux/slice/auth"
import { authInactive } from '../redux/modalSlice'
import apiMain from '../api/apiMain'
import { setLoading, setMessageLogin, setMessageRegister } from '../redux/messageSlice'
import getData from '../api/getData'
import { toast } from "react-toastify";

import { useDispatch } from "react-redux"
import { Navigate, useNavigate } from 'react-router-dom'
import { login, register } from "../api/authApi"
import { getUserStats } from "../api/userStatsApi"
import { useEffect } from "react"
import { updateUserStats } from "../redux/slice/userStats"

const publicPath = [
  '/ddd/', '/truyen/'
]

export const handleLogin = async (user, dispatch, navigate) => {
  dispatch(setLoading(true));
  login(user)
    .then(res => {


      dispatch(loginSuccess(getData(res))); // Lấy thông tin user
      toast.success("Đăng nhập thành công", {
        autoClose: 1200,
        pauseOnHover: false,
        hideProgressBar: true,
      }); // Hiển thị toast thông báo
      dispatch(authInactive()); // Tắt modal login

      window.location.reload(); // Tải lại trang

      useEffect(() => {
        const fetchUserStats = async () => {
          try {
            const response = await getUserStats(user?.id, user, dispatch, loginSuccess)
            const data = response.data;
            dispatch(updateUserStats(data))
          } catch (error) {
            console.error("Error fetching user stats:", error);
          }
        }
        fetchUserStats();
      }, [user])

      // Logic điều hướng dựa trên role
      if (res.data.roles.includes('ADMIN')) {
        navigate("/admin"); // Chuyển đến trang admin nếu có role ADMIN
        window.location.reload(); 
      } else {
        navigate('/'); // Chuyển đến trang user nếu không có role ADMIN
        window.location.reload();
      }
    })
    .catch(error => {


      dispatch(loginFalse());
      const msg = error.response?.data?.details;
      let _ = msg?.username || msg?.password || msg?.active || error.message || "Đăng nhập thất bại";
      dispatch(setMessageLogin(_));
    })
    .finally(() => {
      dispatch(setLoading(false));
    });
};

export const handleRegister = async (params, dispatch, navigate) => {
  try {
    dispatch(setLoading(true))
    const res = await register(params) //gọi api login
    if (res.status == 200) {
      dispatch(setMessageRegister(""));
      toast.success("Đăng ký thành công.", { autoClose: 3000, pauseOnHover: false });//hiển thị toast thông báo
      dispatch(authInactive()) //hành động tắt modal register
    }
  } catch (error) {
    //console.log(error)
    const msg = error.response?.data?.details
    let _ = msg.email || msg.username || msg.password
    console.log(error.response.data)
    dispatch(setMessageRegister(_));
  }
  finally {
    dispatch(setLoading(false))
  }
}

export const handleLogout = (dispatch, navigate, location) => {
  const isPublic = publicPath.findIndex(e => location.pathname.includes(e)) > 0 ? true : false
  dispatch(logoutSuccess())
  toast.success("Đăng xuất thành công", { autoClose: 800, pauseOnHover: false, hideProgressBar: true });//hiển thị toast thông báo
  console.log(isPublic)
  if (!isPublic)
    navigate('/')
}

export const HandleLogoutWhenError = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  dispatch(logoutSuccess())
  navigate('/')
}


