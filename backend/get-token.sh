curl -k -s -X POST https://keycloak.apps.i7mvwf9w.eastus.aroapp.io/realms/demo/protocol/openid-connect/token \
                                                      -H "Content-Type: application/x-www-form-urlencoded" \
                                                      -d "grant_type=client_credentials" \
                                                      -d "client_id=todo-backend" \
                                                      -d "client_secret=Y7LHXNOE9dE3qpMmAPrhpJ7A3d6u91As"