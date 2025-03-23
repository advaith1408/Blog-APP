import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard container mt-4">
      <h2 className="text-center">Admin Dashboard</h2>

      {/* Navigation Links */}
      <ul className="d-flex justify-content-around list-unstyled fs-4 mt-3">
        <li className="nav-item">
          <NavLink to="users" className="btn btn-primary">Manage Users</NavLink>
        </li>
      </ul>

      {/* Nested Routes */}
      <div className="mt-4">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
