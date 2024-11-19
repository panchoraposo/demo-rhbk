1. Generate a self-signed certificate
openssl req -subj '/CN=demo.keycloak.org/O=Demo Keycloak./C=US' -newkey rsa:2048 -nodes -keyout key.pem -x509 -days 365 -out ./tls/certificate.pem

2. Secret
oc create secret tls my-tls-secret --cert ./tls/certificate.pem --key ./tls/key.pem

3. Database
oc create secret generic keycloak-db-secret \
  --from-literal=username=[your_database_username] \
  --from-literal=password=[your_database_password]


4. Create React app
npx create-react-app react-app

