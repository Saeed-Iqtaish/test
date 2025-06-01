import React, { useState } from 'react';
import { Container, Card, Tabs, Tab } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import useUserProfile from '../hooks/useUserProfile .js'; 
import ProfileSettingsForm from '../components/account/settings/ProfileSettingsForm';
import DietaryRestrictionsCard from '../components/account/settings/DietaryRestrictionsCard';
import AccountInfoCard from '../components/account/settings/AccountInfoCard';
import MyRecipes from '../components/account/recipes/MyRecipes'; 
import { AuthModal } from '../components/auth/AuthModal';
import '../styles/pages/account-page.css';

const AccountPage = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const {
    formData,
    editMode,
    loading,
    updating,
    message,
    error,
    handleInputChange,
    handleAllergyChange,
    handleSave,
    handleCancel,
    handleEditMode
  } = useUserProfile();

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
          <div className="alert alert-info">
            <h4 className="alert-heading">Login Required</h4>
            <p>You need to be logged in to access your account.</p>
            <button
              className="btn btn-primary btn-main"
              onClick={() => setShowAuthModal(true)}
            >
              Log In
            </button>
          </div>
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
                  <ProfileSettingsForm
                    formData={formData}
                    editMode={editMode}
                    onInputChange={handleInputChange}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    onEditMode={handleEditMode}
                    loading={updating}
                    error={error}
                    message={message}
                  />

                  <DietaryRestrictionsCard
                    allergies={formData.allergies}
                    editMode={editMode}
                    onAllergyChange={handleAllergyChange}
                  />

                  <AccountInfoCard
                    user={user}
                    allergies={formData.allergies}
                  />
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