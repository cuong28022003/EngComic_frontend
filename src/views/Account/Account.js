import React, { useCallback } from 'react'

import { Link, useLocation, useNavigate, useParams, Outlet, NavLink } from 'react-router-dom';
import Layout from '../../layout/MainLayout';

import { useEffect, useState } from 'react';
import apiMain from '../../api/apiMain';
import { loginSuccess, logoutSuccess } from '../../redux/slice/auth';
import { useSelector, useDispatch } from 'react-redux'
import getData from '../../api/getData';
import ChangePassword from './ChangePassword'
import Profile from './Profile/Profile';
import Bookshelf from './Bookshelf';
import { toast } from 'react-toastify';
import CreateComic from './CreateComic';
import LoadingData from '../../components/Loading/LoadingData';
import { routeLink } from '../../routes/AppRoutes';
import './styles.scss';

function Account() {
  const menu = [//menu dựa trên từng loại tài khoản
    {
      path: "profile",
      display: "Hồ sơ",
      icon: ""
    },
    {
      path: "change-password",
      display: "Đổi mật khẩu",
      icon: ""
    },
    {
      path: "bookshelf",
      display: "Tủ truyện",
      icon: ""
    },
    {
      path: "create-comic",
      display: "Đăng truyện",
      icon: ""
    },
  ]

  const navigate = useNavigate()
  const [userInfo, setUserInfo] = useState(null)
  const user = useSelector(state => state.auth.login?.user);
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const active = menu.findIndex(e => e.path === pathname.split('/')[2]);

  useEffect(() => {
    const getUser = async () => {//xử lý load thông tin user
      try {
        const res = getData(await apiMain.getUserInfo(user, dispatch, loginSuccess));
        setUserInfo(res.userInfo)
      } catch (err) {
        if (err.response.status === 403 || err.response.status === 401) {
          //toast.warning("Phiên đăng nhập của bạn đã hết. Vui lòng đăng nhập lại",
          //  {autoClose: 800,pauseOnHover: false,hideProgressBar: true})
          dispatch(logoutSuccess())
          //navigate('/')
        }
        else {
          toast.error("Lỗi thông tin",
            { autoClose: 800, pauseOnHover: false, hideProgressBar: true })
        }
      }

    }
    getUser()
  }, [])

  const changeUserInfo = useCallback((data) => {
    setUserInfo(data)
  })

  return (
    <Layout >
      <div className="main-content">
        <div className="d-flex">
          <div className="col-3">
            <ul className="list-group">
              {
                menu.map((item, index) => {
                  return <NavLink key={index} to={`${routeLink.account}/${item.path}`} className={`list-group__item`} end={false}>{ item.display}</NavLink>
                })
              }
            </ul>

          </div>
          <div className="col-9 " style={{ 'minHeight': '500px' }}>
              <Outlet/>
          </div>
        </div>
      </div>
    </Layout>
  )
}


export default Account