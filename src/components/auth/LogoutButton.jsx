import React from 'react';
import { Button } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';

const LogoutButton = () => {
  const { logout } = useAuth();

  return (
    <Button variant="outline-danger" onClick={logout}>
      Log Out
    </Button>
  );
};

export default LogoutButton;