// keycloak.js
import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
    url:  process.env.KEYCLOAK_URL || 'https://keycloak.apps.cluster-2xg4r.2xg4r.sandbox2806.opentlc.com/',
    realm: 'demo',
    clientId: 'movies-frontend'
});

export default keycloak;