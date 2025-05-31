import React, { useState } from 'react';
import { Container, Alert, Button } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { AuthModal } from './AuthModal';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (isLoading) {
    return (
      <Container className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading...</p>
      </Container>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Container className="text-center py-5">
          <Alert variant="info">
            <Alert.Heading>Login Required</Alert.Heading>
            <p>You need to be logged in to access this page.</p>
            <Button 
              variant="primary"
              onClick={() => setShowAuthModal(true)}
            >
              Log In
            </Button>
          </Alert>
        </Container>

        <AuthModal
          show={showAuthModal}
          onHide={() => setShowAuthModal(false)}
          onSuccess={() => setShowAuthModal(false)}
        />
      </>
    );
  }

  return children;
};

export default ProtectedRoute;