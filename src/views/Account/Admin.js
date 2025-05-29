import { Link, useLocation, Route, Routes, useNavigate } from 'react-router-dom';
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
import ComicList from './ComicList';
import { handleLogout } from '../../handle/handleAuth';
import './Admin.scss';
import Rank from './Rank';
import ReportList from './ReportList';

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
      path: "rank",
      display: "Rank",
      icon: "",
    },
    {
      path: "report",
      display: "Tố cáo",
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
    },
  ];

  const user = useSelector((state) => state.auth.login?.user);
  const [userInfo, setUserInfo] = useState(null);
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const active = menu.findIndex((e) => e.path === pathname.split('/')[2]);

  useEffect(() => {
    const getUser = async () => {
      const res = getData(await apiMain.getUserInfo(user, dispatch, loginSuccess));
      setUserInfo(res.userInfo);
    };
    getUser();
  }, []);

  const onClickLogout = () => {
    handleLogout(dispatch, navigate, location);
  };

  return (
    <div className="account-container">
      <div className="container mx-auto px-6">
        <h1 className="admin-header">
          Admin Dashboard
        </h1>
        <div className="d-flex flex flex-col md:flex-row gap-8">
          <div className="col-2 md:w-1/5">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4 bg-opacity-90">
              <ul className="account-menu flex flex-row flex-wrap gap-3">
                {menu.map((item, index) => (
                  <li
                    key={index}
                    className={`list-group__item rounded-lg px-4 py-2 transition-all duration-300 ${
                      index === active
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200 hover:shadow-sm'
                    }`}
                  >
                    {item.path ? (
                      <Link
                        to={item.path}
                        className="block text-current no-underline font-semibold text-sm"
                      >
                        {item.display}
                      </Link>
                    ) : (
                      <button
                        onClick={onClickLogout}
                        className="block w-full text-left text-current no-underline font-semibold text-sm bg-transparent border-none cursor-pointer"
                      >
                        {item.display}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="col-10 md:w-4/5">
            <div className="bg-white rounded-xl shadow-lg p-8 bg-opacity-90">
              <Routes>
                <Route path="profile" element={<Profile userInfo={userInfo} />} />
                <Route path="change-password" element={<ChangePassword />} />
                <Route path="users" element={<Users dispatch={dispatch} />} />
                <Route path="delete-truyen" element={<ComicList dispatch={dispatch} />} />
                <Route path="tu-truyen/*" element={<Bookshelf userInfo={userInfo} />} />
                <Route path="rank" element={<Rank />} /> 
                <Route path="report" element={<ReportList/>}/>              
                <Route path="dang-truyen" element={<CreateComic userInfo={userInfo} />} />
              </Routes>
            </div>
          </div>
        </div>
        <footer style={{ textAlign: 'center', padding: '1rem', color: '#fff', fontSize: '14px' }}>
          © 2025 EngComic Admin. Team Cuong-Trong_Ms.Tho. | Version 1.0.0
        </footer>
      </div>
    </div>
  );
}

export default Account;