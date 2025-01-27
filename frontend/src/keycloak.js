// keycloak.js
import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
    url:  process.env.KEYCLOAK_URL || "https://keycloak.apps.i7mvwf9w.eastus.aroapp.io", // Keycloak base URL
    realm: 'demo',         // Realm name
    clientId: 'todo-frontend',   // Client ID
});

console.log('KEYCLOAK_URL:', keycloak);
export default keycloak;