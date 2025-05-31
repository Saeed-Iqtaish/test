import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Tabs, Tab } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from '../components/auth/AuthModal';
import { userAPI } from '../services/api';
import AllergySelector from '../components/filterPanel/AllergySelector';
import MyRecipes from '../components/account/MyRecipes';
import '../styles/pages/account-page.css';

const AccountPage = () => {
  const { user, isAuthenticated, isLoading, refreshProfile } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    allergies: user?.allergies || []
  });
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch complete user profile when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserProfile();
    }
  }, [isAuthenticated]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getProfile();
      const userData = response.data;
      
      setFormData({
        username: userData.username || '',
        email: userData.email || '',
        allergies: userData.allergies || []
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAllergyChange = (selectedAllergies) => {
    setFormData({
      ...formData,
      allergies: selectedAllergies
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
      
      // Refresh auth context to update user data
      await refreshProfile();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username || '',
      email: user?.email || '',
      allergies: user?.allergies || []
    });
    setEditMode(false);
    setError('');
    setMessage('');
  };

  if (isLoading || loading) {
    return (
      <Container className="text-center py-5">
        <div className="spinner-border spinner-main" role="status">
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
              className="btn-main"
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

  return (
    <Container className="py-4">
      <div className="row justify-content-center">
        <div className="col-12">
          <Card className="account-card">
            <Card.Header className="account-card-header">
              <h4 className="mb-0">Account Settings</h4>
            </Card.Header>
            <Card.Body>
              {/* Add Tabs for Account Settings and My Recipes */}
              <Tabs defaultActiveKey="settings" className="account-tabs mb-4">
                <Tab eventKey="settings" title="Settings">
                  {message && <Alert variant="success" className="alert-success-custom">{message}</Alert>}
                  {error && <Alert variant="danger" className="alert-danger-custom">{error}</Alert>}

                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-custom">Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        className="form-control-custom"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-custom">Password</Form.Label>
                      <Form.Control
                        type="password"
                        value="••••••••••••••••••••"
                        disabled
                        className="form-control-custom"
                      />
                    </Form.Group>

                    {/* Dietary Restrictions and Allergies Section */}
                    <Form.Group className="mb-4">
                      <Form.Label className="mb-3 form-label-custom">
                        <strong>Dietary Restrictions and Allergies</strong>
                      </Form.Label>
                      
                      <div className={editMode ? '' : 'pe-none opacity-75'}>
                        <AllergySelector
                          selected={formData.allergies}
                          onSelect={handleAllergyChange}
                        />
                      </div>
                      
                      {!editMode && formData.allergies.length === 0 && (
                        <p className="text-muted mt-2 mb-0">
                          <em>No allergies selected</em>
                        </p>
                      )}
                    </Form.Group>

                    <div className="d-flex gap-2">
                      {!editMode ? (
                        <Button 
                          className="btn-main w-100"
                          onClick={() => setEditMode(true)}
                        >
                          Update Account
                        </Button>
                      ) : (
                        <>
                          <Button 
                            variant="outline-secondary"
                            className="btn-cancel flex-fill"
                            onClick={handleCancel}
                            disabled={updating}
                          >
                            Cancel
                          </Button>
                          <Button 
                            className="btn-success-custom flex-fill"
                            onClick={handleSave}
                            disabled={updating}
                          >
                            {updating ? 'Saving...' : 'Save'}
                          </Button>
                        </>
                      )}
                    </div>
                  </Form>

                  {/* Account Information Card */}
                  <Card className="mt-4 info-card">
                    <Card.Header className="info-card-header">
                      <h5 className="mb-0">Account Information</h5>
                    </Card.Header>
                    <Card.Body>
                      <div className="mb-2">
                        <strong>Account Type:</strong> {user?.isAdmin ? 'Administrator' : 'Regular User'}
                      </div>
                      <div className="mb-2">
                        <strong>Member Since:</strong> {new Date().toLocaleDateString()}
                      </div>
                      {formData.allergies.length > 0 && (
                        <div className="mb-2">
                          <strong>Active Allergy Filters:</strong> {formData.allergies.length} selected
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Tab>

                <Tab eventKey="my-recipes" title="My Recipes">
                  <MyRecipes />
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default AccountPage;