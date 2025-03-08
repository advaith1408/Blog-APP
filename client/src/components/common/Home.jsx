import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom"; // ✅ Import navigate
import { userAuthorContextObj } from '../../contexts/userAuthorContext';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import '../styling/Home.css';
function Home() {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(userAuthorContextObj);
  const { isSignedIn, user, isLoaded } = useUser();
  const [error, setError] = useState(""); // ✅ State to store error messages

  // Handle Role Selection
  async function onSelectRole(e) {
    const selectedRole = e.target.value;
    const updatedUser = { ...currentUser, role: selectedRole };
    let res = null;

    try {
      if (selectedRole === 'author') {
        res = await axios.post('http://localhost:3000/author-api/author', updatedUser);
      } else if (selectedRole === 'user') {
        res = await axios.post('http://localhost:3000/user-api/user', updatedUser);
      }

      if (res?.data?.message === selectedRole) {
        setCurrentUser(prevUser => ({ ...prevUser, ...updatedUser, ...res.data.payload }));
        setError(""); // Clear error if role is valid
      } else {
        setError("Invalid Role"); // Display error message
      }
    } catch (error) {
      console.error('Error updating role:', error);
      setError("An error occurred while updating the role.");
    }
  }

  // Set Current User when user data is loaded
  useEffect(() => {
    if (isLoaded && user) {
      setCurrentUser(prevUser => ({
        ...prevUser,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.emailAddresses[0]?.emailAddress || '',
        profileImageUrl: user.imageUrl,
      }));
    }
  }, [isLoaded, user, setCurrentUser]);

  // Navigate based on user role
  useEffect(() => {
    if (!currentUser?.email || !currentUser?.role || error) return;

    if (currentUser.role === "user") {
      navigate(`/user-profile/${currentUser.email}`);
    }

    if (currentUser.role === "author") {
      console.log("Navigating to author profile...");
      navigate(`/author-profile/${currentUser.email}`);
    }
  }, [currentUser?.role, error, navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 flex-column">
      {/* Guest View */}
      {!isSignedIn && (
        <div>
        <h2>Welcome to the Blog Platform!</h2>
        <p>Discover insightful articles, share your thoughts, and connect with a community of passionate writers.</p>
        <p>Sign up to start your journey or log in to continue exploring.</p>
      </div>      
      )}

      {/* Authenticated User View */}
      {isSignedIn && (
        <div>
          {/* Profile Card */}
          <div className="card p-4 shadow-lg text-center">
            <div className="d-flex align-items-center">
              <img 
                src={currentUser?.profileImageUrl || user?.imageUrl} 
                alt="Profile" 
                className="rounded-circle border border-light me-3"
                style={{ width: '100px', height: '100px', objectFit: 'cover' }} 
              />
              <p className="fs-4 fw-bold mb-0">
                {currentUser?.firstName || user?.firstName} {currentUser?.lastName || user?.lastName}
              </p>
            </div>
          </div>

          {/* Role Selection Card */}
<div className="role-card card p-4 shadow-lg mt-4">
  <p className="role-title">Select Your Role:</p>
  <div className="role-options">
    <div className="role-option">
      <input type="radio" id="author" name="role" value="author" className="form-check-input" onChange={onSelectRole}/>
      <label htmlFor="author" className="form-check-label">Author</label>
    </div>
    <div className="role-option">
      <input type="radio" id="user" name="role" value="user" className="form-check-input" onChange={onSelectRole}/>
      <label htmlFor="user" className="form-check-label">User</label>
    </div>
  </div>
</div>


          {/* Error Message Display */}
          {error && (
            <p className="text-danger fs-5 mt-2" style={{ fontFamily: "sans-serif" }}>
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
