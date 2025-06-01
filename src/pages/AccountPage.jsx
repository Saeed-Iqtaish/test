import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Tabs, Tab, Row, Col } from 'react-bootstrap';
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
      setMessage('Profile updated successfully! Your allergy preferences will be applied automatically when browsing recipes.');
      setEditMode(false);
      
      // Refresh auth context to update user data everywhere
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
              <Tabs defaultActiveKey="settings" className="account-tabs mb-4">
                <Tab eventKey="settings" title="Settings">
                  {message && <Alert variant="success" className="alert-success-custom">{message}</Alert>}
                  {error && <Alert variant="danger" className="alert-danger-custom">{error}</Alert>}

                  <Form>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="form-label-custom">Username</Form.Label>
                          <Form.Control
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            className="form-control-custom"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
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
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-custom">Password</Form.Label>
                      <Form.Control
                        type="password"
                        value="••••••••••••••••••••"
                        disabled
                        className="form-control-custom"
                      />
                      <Form.Text className="text-muted">
                        Contact support to change your password
                      </Form.Text>
                    </Form.Group>

                    {/* Enhanced Dietary Restrictions and Allergies Section */}
                    <Card className="mb-4">
                      <Card.Header className="bg-light">
                        <h6 className="mb-0 d-flex align-items-center">
                          <span className="me-2">🚫</span>
                          Dietary Restrictions and Allergies
                        </h6>
                      </Card.Header>
                      <Card.Body>
                        <Form.Text className="text-muted mb-3 d-block">
                          Select your allergies and dietary restrictions. These will be automatically filtered out when you browse recipes to ensure your safety and preferences.
                        </Form.Text>
                        
                        <div className={editMode ? '' : 'pe-none opacity-75'}>
                          <AllergySelector
                            selected={formData.allergies}
                            onSelect={handleAllergyChange}
                            userAllergies={formData.allergies} // Pass current allergies as user allergies
                          />
                        </div>
                        
                        {!editMode && formData.allergies.length === 0 && (
                          <Alert variant="info" className="mt-3 mb-0">
                            <small>
                              <strong>No allergies selected.</strong> You can add your allergies to automatically filter out recipes that may contain allergens.
                            </small>
                          </Alert>
                        )}
                        
                        {!editMode && formData.allergies.length > 0 && (
                          <Alert variant="success" className="mt-3 mb-0">
                            <small>
                              <strong>Active allergy filters:</strong> {formData.allergies.join(', ')}
                              <br />
                              <em>These ingredients will be automatically filtered out when browsing recipes.</em>
                            </small>
                          </Alert>
                        )}
                      </Card.Body>
                    </Card>

                    <div className="d-flex gap-2">
                      {!editMode ? (
                        <Button 
                          className="btn-main w-100"
                          onClick={() => setEditMode(true)}
                        >
                          Edit Profile
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
                            {updating ? 'Saving...' : 'Save Changes'}
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
                          <br />
                          <small className="text-muted">
                            Recipes containing {formData.allergies.join(', ')} will be automatically filtered out
                          </small>
                        </div>
                      )}
                      <div className="mb-0">
                        <strong>Auto-filtering:</strong> {formData.allergies.length > 0 ? 'Enabled' : 'Disabled'}
                      </div>
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