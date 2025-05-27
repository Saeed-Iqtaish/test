import React from 'react';
import { Container, Spinner, Alert } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';
import LoginButton from './LoginButton';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading...</p>
      </Container>
    );
  }

  if (!isAuthenticated) {
    return (
      <Container className="text-center py-5">
        <Alert variant="info">
          <Alert.Heading>Login Required</Alert.Heading>
          <p>You need to be logged in to access this page.</p>
          <LoginButton />
        </Alert>
      </Container>
    );
  }

  return children;
};

export default ProtectedRoute;