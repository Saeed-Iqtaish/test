import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from '../components/auth/AuthModal';
import { userAPI } from '../services/api';

const AccountPage = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || ''
  });
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  if (isLoading) {
    return (
      <Container className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Container className="text-center py-5">
          <Alert variant="info">
            <Alert.Heading>Login Required</Alert.Heading>
            <p>You need to be logged in to access your account.</p>
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

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    setUpdating(true);
    setError('');
    setMessage('');

    try {
      await userAPI.updateProfile(formData);
      setMessage('Profile updated successfully!');
      setEditMode(false);
      // Update local user data
      window.location.reload(); // Simple way to refresh user data
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user.username,
      email: user.email
    });
    setEditMode(false);
    setError('');
    setMessage('');
  };

  return (
    <Container className="py-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <Card>
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">Account Settings</h4>
            </Card.Header>
            <Card.Body>
              {message && <Alert variant="success">{message}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}

              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    disabled={!editMode}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!editMode}
                  />
                </Form.Group>

                {user.isAdmin && (
                  <Alert variant="success" className="mb-3">
                    <strong>Admin Account</strong>
                    <br />
                    You have administrator privileges.
                  </Alert>
                )}

                <div className="d-flex gap-2">
                  {!editMode ? (
                    <Button 
                      variant="primary" 
                      onClick={() => setEditMode(true)}
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <>
                      <Button 
                        variant="success" 
                        onClick={handleSave}
                        disabled={updating}
                      >
                        {updating ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button 
                        variant="secondary" 
                        onClick={handleCancel}
                        disabled={updating}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </Form>
            </Card.Body>
          </Card>

          <Card className="mt-4">
            <Card.Header>
              <h5 className="mb-0">Account Information</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-2">
                <strong>Account Type:</strong> {user.isAdmin ? 'Administrator' : 'Regular User'}
              </div>
              <div className="mb-2">
                <strong>Member Since:</strong> {new Date().toLocaleDateString()}
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default AccountPage;