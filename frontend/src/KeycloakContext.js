import React, { createContext, useState, useEffect } from 'react';
import keycloak from './keycloak'; // Import the singleton Keycloak instance

// Create a Context for Keycloak
export const KeycloakContext = createContext();

// Create the Provider
export const KeycloakProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [keycloakInitialized, setKeycloakInitialized] = useState(false);
    const [setToken] = useState("");

    useEffect(() => {
        // Check if Keycloak has already been initialized
        if (!keycloakInitialized) {
            keycloak
                .init({ onLoad: 'login-required' })
                .then((authenticated) => {
                    setIsAuthenticated(authenticated);
                    setKeycloakInitialized(true); // Mark Keycloak as initialized
                    console.log(keycloak.token);
                    setToken(keycloak.token);
                })
                .catch((err) => {
                    console.error('Keycloak initialization failed:', err);
                });
        }
    }, [keycloak]); // This useEffect runs unconditionally but checks initialization status inside

    return (
        <KeycloakContext.Provider value={{ keycloak, isAuthenticated }}>
            {children}
        </KeycloakContext.Provider>
    );
};