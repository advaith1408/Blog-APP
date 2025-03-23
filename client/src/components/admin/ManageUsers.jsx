import React, { useEffect, useState } from "react";
import axios from "axios";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  // Fetch users and authors
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/admin-api/users");
        console.log("Fetched Users:", response.data); // 🔍 Debugging
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
  
    fetchUsers();
  }, []);
  
  // Function to toggle block/unblock status
const toggleBlockStatus = async (userId, currentStatus) => {
  try {
    const response = await axios.put(`http://localhost:3000/admin-api/users/${userId}/status`, {
      isActive: !currentStatus, // Toggle status
    });

    if (response.status === 200) {
      setUsers(users.map(user => 
        user._id === userId ? { ...user, isActive: !currentStatus } : user
      ));
    }
  } catch (error) {
    console.error("Error updating user status:", error);
  }
};


  return (
    <div className="container">
      <h3 className="mb-3">Manage Users & Authors</h3>
      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.isActive ? "Active" : "Blocked"}</td>
              <td>
                <button
                  className={`btn ${user.isActive ? "btn-danger" : "btn-success"}`}
                  onClick={() => toggleBlockStatus(user._id, user.isActive)}
                >
                  {user.isActive ? "Block" : "Unblock"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
