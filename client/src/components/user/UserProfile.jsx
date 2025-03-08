import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import '../styling/UserProfile.css';

function UserProfile() {
  return (
    <div className="user-profile">
      {/* Large User Profile Card */}
      <div className="user-card">
        <h2>User Dashboard</h2>
      </div>

      {/* Navigation Bar */}
      <ul className="d-flex justify-content-around list-unstyled fs-1 nav-container">
        <li className="nav-item">
          <Link to="articles" className="nav-link">Articles</Link>
        </li>
      </ul>

      {/* Content Section */}
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

export default UserProfile;
