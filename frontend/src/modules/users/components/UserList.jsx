import React from 'react';

const UserList = ({ users, onEdit, onDelete, loading }) => {
  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  if (users.length === 0) {
    return <div className="no-users">No users found.</div>;
  }

  return (
    <div className="user-list">
      <table className="user-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>
                <span className={`role-badge role-${user.role}`}>
                  {user.role}
                </span>
              </td>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              <td>
                <div className="action-buttons">
                  <button 
                    className="btn-edit"
                    onClick={() => onEdit(user)}
                    aria-label={`Edit ${user.username}`}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => onDelete(user)}
                    aria-label={`Delete ${user.username}`}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;