import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';

const Auth0ProviderWithHistory = ({ children }) => {
  const domain = process.env.REACT_APP_AUTH0_DOMAIN;
  const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
  const audience = process.env.REACT_APP_AUTH0_AUDIENCE;

  console.log('Auth0 Config Check:', {
    domain,
    clientId,
    audience,
    redirectUri: window.location.origin
  });

  if (!domain || !clientId) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h3>Auth0 Configuration Error</h3>
        <p>Missing environment variables:</p>
        <ul>
          <li>REACT_APP_AUTH0_DOMAIN: {domain || 'MISSING'}</li>
          <li>REACT_APP_AUTH0_CLIENT_ID: {clientId || 'MISSING'}</li>
        </ul>
        <p>Please check your .env file in the root directory.</p>
      </div>
    );
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: audience,
        scope: "openid profile email"
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithHistory;