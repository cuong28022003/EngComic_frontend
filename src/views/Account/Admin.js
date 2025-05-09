import { Link, useLocation, Route, Routes, useNavigate } from 'react-router-dom';
import Layout from '../../layout/MainLayout';
import { useEffect, useState } from 'react';
import apiMain from '../../api/apiMain';
import { loginSuccess } from '../../redux/slice/auth';
import { useSelector, useDispatch } from 'react-redux';
import getData from '../../api/getData';
import ChangePassword from './ChangePassword';
import Profile from './Profile/Profile';
import Users from './Users';
import Bookshelf from './Bookshelf';
import CreateComic from './CreateComic';
import DeleteComic from './DeleteComic';
import { handleLogout } from '../../handle/handleAuth';

function Account() {
  const menu = [
    {
      path: "profile",
      display: "Hồ sơ",
      icon: "",
    },
    {
      path: "change-password",
      display: "Đổi mật khẩu",
      icon: "",
    },
    {
      path: "users",
      display: "Thành viên",
      icon: "",
    },
    {
      path: "delete-truyen",
      display: "Quản lý truyện",
      icon: "",
    },
    {
      path: "tu-truyen/reading",
      display: "Tủ truyện",
      icon: "",
    },
    {
      path: "dang-truyen",
      display: "Đăng truyện",
      icon: "",
    },
    {
      display: "Đăng xuất",
      icon: "",
      // Không có path, chỉ có onClick
    },
  ];

  const user = useSelector((state) => state.auth.login?.user);
  const [userInfo, setUserInfo] = useState(null);
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const active = menu.findIndex((e) => e.path === pathname.split('/')[2]);

  useEffect(() => {
    const getUser = async () => {
      const res = getData(await apiMain.getUserInfo(user, dispatch, loginSuccess));
      setUserInfo(res.userInfo);
    };
    getUser();
  }, []);
   let location = useLocation();
  const onClickLogout = () => {
          handleLogout(dispatch, navigate, location)
      }

  return (
    <Layout>
      <div className="main-content">
        <div className="d-flex">
          <div className="col-3">
            <ul className="list-group">
              {menu.map((item, index) => (
                <li
                  key={index}
                  className={`list-group__item ${index === active ? 'active' : ''}`}
                >
                  {item.path ? (
                    <Link to={item.path}>{item.display}</Link>
                  ) : (
                    <a onClick={onClickLogout}>{item.display}</a>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className="col-9" style={{ minHeight: '500px' }}>
            <Routes>
              <Route path="profile" element={<Profile userInfo={userInfo} />} />
              <Route path="change-password" element={<ChangePassword />} />
              <Route path="users" element={<Users dispatch={dispatch} />} />
              <Route path="delete-truyen" element={<DeleteComic dispatch={dispatch} />} />
              <Route path="tu-truyen/*" element={<Bookshelf userInfo={userInfo} />} />
              <Route path="dang-truyen" element={<CreateComic userInfo={userInfo} />} />
            </Routes>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Account;