import React from 'react';
import { Button } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';

const LoginButton = () => {
  const { login } = useAuth();

  return (
    <Button variant="primary" onClick={login}>
      Log In
    </Button>
  );
};

export default LoginButton;