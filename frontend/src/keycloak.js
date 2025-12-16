// keycloak.js
import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
    url:  'https://keycloak.apps.cluster-67nv6.67nv6.sandbox864.opentlc.com', // Keycloak base URL
    realm: 'demo',         // Realm name
    clientId: 'todo-frontend',   // Client ID
});

console.log('KEYCLOAK_URL:', keycloak);
export default keycloak;
