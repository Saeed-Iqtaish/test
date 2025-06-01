import React, { useState } from "react";
import { Container, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { AuthModal } from "../components/auth/AuthModal";
import AdminHeader from "../components/admin/AdminHeader";
import AdminPendingRecipes from "../components/admin/AdminPendingRecipes";
import AdminStats from "../components/admin/AdminStats";
import "../styles/pages/admin-page.css";

function AdminPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRecipeStatusChange = () => {
    setRefreshTrigger(prev => prev + 1);
  };

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
          <Alert variant="warning">
            <Alert.Heading>Admin Access Required</Alert.Heading>
            <p>You need to be logged in as an administrator to access this page.</p>
            <button
              className="btn btn-primary"
              onClick={() => setShowAuthModal(true)}
            >
              Log In
            </button>
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

  if (!user?.isAdmin) {
    return (
      <Container className="text-center py-5">
        <Alert variant="danger">
          <Alert.Heading>Access Denied</Alert.Heading>
          <p>You don't have administrator privileges to access this page.</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4 admin-page">
      <AdminHeader user={user} />

      <AdminStats refreshTrigger={refreshTrigger} />

      <AdminPendingRecipes 
        refreshTrigger={refreshTrigger}
        onRecipeStatusChange={handleRecipeStatusChange}
      />
    </Container>
  );
}

export default AdminPage;