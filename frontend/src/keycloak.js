// keycloak.js
import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
    url:  process.env.KEYCLOAK_URL, // Keycloak base URL
    realm: 'demo',         // Realm name
    clientId: 'todo-frontend',   // Client ID
});

console.log('KEYCLOAK_URL:', keycloak);
export default keycloak;
