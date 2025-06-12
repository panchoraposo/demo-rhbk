import React, { createContext, useEffect, useState } from 'react';
import Keycloak from 'keycloak-js';

export const KeycloakContext = createContext();

export const KeycloakProvider = ({ children }) => {
  const [keycloak, setKeycloak] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const kc = new Keycloak({
      url: 'https://keycloak.apps.cluster-2xg4r.2xg4r.sandbox2806.opentlc.com', // SIN /auth
      realm: 'demo',
      clientId: 'movies-frontend'
    });

    kc.init({ onLoad: 'login-required', checkLoginIframe: false })
      .then(authenticated => {
        console.log('[Keycloak] Authenticated:', authenticated);
        setKeycloak(kc);
        setIsAuthenticated(authenticated);
      })
      .catch(err => {
        console.error('[Keycloak] Init failed', err);
      });
  }, []);

  if (!keycloak) return <div>Inicializando Keycloak...</div>;

  return (
    <KeycloakContext.Provider value={{ keycloak, isAuthenticated }}>
      {children}
    </KeycloakContext.Provider>
  );
};