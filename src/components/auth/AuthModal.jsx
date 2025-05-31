import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

const AuthModal = ({ show, onHide, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);

  const handleSuccess = () => {
    onSuccess();
  };

  const handleClose = () => {
    setIsLogin(true);
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Body className="p-4">
        {isLogin ? (
          <LoginForm
            onSuccess={handleSuccess}
            onSwitchToSignup={() => setIsLogin(false)}
          />
        ) : (
          <SignupForm
            onSuccess={handleSuccess}
            onSwitchToLogin={() => setIsLogin(true)}
          />
        )}
      </Modal.Body>
    </Modal>
  );
};

export { AuthModal };