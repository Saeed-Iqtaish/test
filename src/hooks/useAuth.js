// src/hooks/useAuth.js
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { setAuthToken, userAPI } from '../services/api';

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout,
    getAccessTokenSilently
  } = useAuth0();

  // Set up API token interceptor when authenticated
  useEffect(() => {
    if (isAuthenticated && getAccessTokenSilently) {
      setAuthToken(getAccessTokenSilently);
      
      // Create user profile on first login
      userAPI.createProfile().catch(error => {
        console.error('Error creating user profile:', error);
      });
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  const handleLogin = () => {
    loginWithRedirect();
  };

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login: handleLogin,
    logout: handleLogout,
    getAccessTokenSilently
  };
};