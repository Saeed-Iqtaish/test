import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';

const Profile = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <Dropdown>
      <Dropdown.Toggle 
        variant="outline-primary" 
        id="profile-dropdown"
        className="d-flex align-items-center gap-2"
      >
        <div className="d-flex align-items-center">
          <div 
            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2"
            style={{ width: '32px', height: '32px', fontSize: '14px', fontWeight: 'bold' }}
          >
            {user.username.charAt(0).toUpperCase()}
          </div>
          <span>{user.username}</span>
        </div>
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.ItemText>
          <strong>{user.username}</strong>
          <br />
          <small className="text-muted">{user.email}</small>
          {user.isAdmin && (
            <>
              <br />
              <small className="text-success">Admin</small>
            </>
          )}
        </Dropdown.ItemText>
        <Dropdown.Divider />
        <Dropdown.Item onClick={logout}>
          Log Out
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default Profile;