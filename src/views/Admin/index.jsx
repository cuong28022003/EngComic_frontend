import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./styles.scss";

const AdminPage = () => {
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
      </div>
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminPage;
