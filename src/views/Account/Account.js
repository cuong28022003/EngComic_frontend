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
import { getUserById } from '../../api/userApi';

function Account() {
  const { userId } = useParams(); 
  const user = useSelector(state => state.auth.login?.user);
  const dispatch = useDispatch();
  const isReadOnly = userId && userId !== user?.id;
  // console.log("isReadOnly: ", isReadOnly)
  
  const menu = [//menu dựa trên từng loại tài khoản
    {
      path: "profile",
      display: "Hồ sơ",
      icon: ""
    },
    ...(isReadOnly ? [] : [ // Ẩn mục "Đổi mật khẩu" nếu đang xem tài khoản của người khác
      {
        path: "change-password",
        display: "Đổi mật khẩu",
        icon: ""
      }
    ]),
    {
      path: "bookshelf",
      display: "Tủ truyện",
      icon: ""
    },
    {
      path: "rank",
      display: "Xếp hạng",
      icon: ""
    },
    {
      path: "collection",
      display: "Bộ sưu tập",
      icon: ""
    }
  ]

  return (
      <div className="main-content">
        <div className="d-flex">
          <div className="col-3">
            <ul className="list-group">
            {
              menu.map((item, index) => {
                // console.log("isReadOnly: ", isReadOnly)
                const path = isReadOnly
                  ? `${routeLink.userAccount.replace(':userId', userId)}/${item.path}` // Đường dẫn cho chế độ chỉ xem
                  : `${routeLink.account}/${item.path}`; // Đường dẫn mặc định

                return (
                  <NavLink
                    key={index}
                    to={path}
                    className={`list-group__item`}
                    end={false}
                  >
                    {item.display}
                  </NavLink>
                );
              })
            }
            </ul>

          </div>
          <div className="col-9 " style={{ 'minHeight': '500px' }}>
          <Outlet context={{ isReadOnly }} />
          </div>
        </div>
      </div>
  )
}


export default Account