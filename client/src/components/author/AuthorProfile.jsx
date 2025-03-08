import React from 'react';
import { NavLink, Outlet, useParams } from 'react-router-dom';
import '../styling/AuthorProfile.css';

const AuthorProfile = () => {
  const { email } = useParams(); // ✅ Get email from URL

  return (
    <div className="author-profile">
      <h2 className="text-center">Author Dashboard</h2>

      {/* Navigation Buttons */}
      <ul className="d-flex justify-content-around list-unstyled fs-3">
        <li className="nav-item">
          <NavLink to={`/author-profile/${email}/articles`} className="btn btn-primary">
            Articles
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to={`/author-profile/${email}/article`} className="btn btn-success">
            Add New Article
          </NavLink>
        </li>
      </ul>

      {/* Nested Route Rendering */}
      <div className="mt-5">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthorProfile;
