import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./styles.scss";
import { useDispatch } from "react-redux";
import { handleLogout } from "../../handle/handleAuth";
import { useLocation, useNavigate } from "react-router-dom";

const AdminPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const onClickLogout = () => {
    handleLogout(dispatch, navigate, location)
  }
  return (
    <div className="admin-container">
      <div className="sidebar-menu">
        <h2>Admin Panel</h2>
        <nav>
          <NavLink to="users" className={({ isActive }) => isActive ? "active" : ""}>Quản lý người dùng</NavLink>
          <NavLink to="comics" className={({ isActive }) => isActive ? "active" : ""}>Quản lý truyện</NavLink>
          <NavLink to="reports" className={({ isActive }) => isActive ? "active" : ""}>Quản lý tố cáo</NavLink>
          <NavLink to="ranks" className={({ isActive }) => isActive ? "active" : ""}>Quản lý rank</NavLink>
          <NavLink to="topups" className={({ isActive }) => isActive ? "active" : ""}>Quản lý nạp kim cương</NavLink>
        </nav>
        <button
          className="logout-btn"
          onClick={onClickLogout}
        >
          Đăng xuất
        </button>
      </div>
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminPage;
