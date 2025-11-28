import { useEffect, useState } from 'react';
import axios from 'axios';

function AdminDashboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get("/api/users", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      setUsers(res.data.data);
    });
  }, []);

  const deleteUser = async (id) => {
    const token = localStorage.getItem("token");

    if (!window.confirm("Delete this user?")) return;

    await axios.delete(`/api/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setUsers(users.filter(u => u._id !== id));
  };

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>

      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>

              <td>
                <a href={`/admin/users/${user._id}`}>Edit</a>
              </td>

              <td>
                <button onClick={() => deleteUser(user._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default AdminDashboard;
