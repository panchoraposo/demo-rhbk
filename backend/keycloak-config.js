const session = require('express-session');
const Keycloak = require('keycloak-connect');

const memoryStore = new session.MemoryStore();

const keycloak = new Keycloak({ store: memoryStore }, {
    "realm": "demo",
    "auth-server-url": "https://keycloak.apps.zicqg6sw.eastus.aroapp.io",
    "client-id": "todo-backend",
    "credentials": {
        "secret": "3Q21IQS7DmxScFZ1fkftSZBCTXDlYbU9"
    }
});

module.exports = { keycloak, memoryStore };