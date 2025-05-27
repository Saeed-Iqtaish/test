import React from 'react';
import { useAuth } from '../../hooks/useAuth';

const Profile = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="d-flex align-items-center">
      <img
        src={user.picture}
        alt={user.name}
        className="rounded-circle me-2"
        width="32"
        height="32"
      />
      <span className="text-muted">{user.name}</span>
    </div>
  );
};

export default Profile;