import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
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
  
  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && getAccessTokenSilently) {
      setAuthToken(getAccessTokenSilently);
      fetchUserProfile();
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  const fetchUserProfile = async () => {
    setProfileLoading(true);
    try {
      await userAPI.createProfile();
      const response = await userAPI.getProfile();
      setUserProfile(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setProfileLoading(false);
    }
  };

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
    userProfile,
    isAuthenticated,
    isLoading: isLoading || profileLoading,
    isAdmin: userProfile?.isAdmin || false,
    login: handleLogin,
    logout: handleLogout,
    getAccessTokenSilently,
    refreshProfile: fetchUserProfile
  };
};