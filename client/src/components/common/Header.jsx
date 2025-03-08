import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useClerk, useUser } from '@clerk/clerk-react';
import { userAuthorContextObj } from '../../contexts/userAuthorContext';

function Header() {
  const { signOut } = useClerk();
  const { isSignedIn, user } = useUser();
  const { currentUser, setCurrentUser } = useContext(userAuthorContextObj);
  const navigate = useNavigate();

  // Function to sign out
  async function handleSignout() {
    await signOut();
    setCurrentUser(null);
    navigate('/');
  }

  return (
    <nav
  className="d-flex justify-content-between align-items-center p-3"
  style={{ backgroundColor: "#614E41" }}
>

<div>
  <Link to="/" className="text-white fw-bold fs-4 text-decoration-none">
    <img 
      src="https://i.pinimg.com/474x/14/28/fe/1428fe19e8d0688fcbee04649fc864b1.jpg" 
      alt="Logo" 
      className="rounded-circle"
      style={{ width: "45px", height: "45px", objectFit: "cover" }}
    />
  </Link>
</div>

      <ul className="d-flex list-unstyled gap-4 mb-0 align-items-center">
        {/* If user is not signed in, show Signin and Signup links */}
        {!isSignedIn && (
          <>
            <li>
              <Link to="/" className="text-white text-decoration-none">Home</Link>
            </li>
            <li>
              <Link to="/signin" className="text-white text-decoration-none">Signin</Link>
            </li>
            <li>
              <Link to="/signup" className="text-white text-decoration-none">Signup</Link>
            </li>
          </>
        )}

        {/* If user is signed in, show profile image, name, and signout button */}
        {isSignedIn && (
          <>
            <li className="d-flex flex-column align-items-center">
              <img 
                src={currentUser?.profileImageUrl || user?.imageUrl} 
                alt="Profile" 
                className="rounded-circle border border-light"
                style={{ width: '40px', height: '40px', objectFit: 'cover' }} 
              />
              <span className="text-white small">{currentUser?.firstName || user?.firstName} {currentUser?.lastName || user?.lastName}</span>
            </li>
            <li>
              <button className="btn btn-danger" onClick={handleSignout}>Signout</button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Header;
