// keycloak.js
import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
    url: 'https://keycloak-demo-entel.apps.x9kldjx7.eastus.aroapp.io', // Keycloak base URL
    realm: 'demo',         // Realm name
    clientId: 'todo-frontend',   // Client ID
});

export default keycloak;