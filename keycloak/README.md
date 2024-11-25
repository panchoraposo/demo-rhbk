1. Create database PostgreSQL with name 'keycloak'

2. Create TLS certificates

3. Create secret with .pem files:
``./keycloak/tls/tls-keys.sh``
``oc create secret tls demo-tls-secret --cert certificate.pem --key key.pem``

4. Create secret with database credentials:
``oc create secret generic keycloak-db-secret --from-literal=username=<username> --from-literal=password=<password>``

5. Deploy Keycloak instance:
``oc apply -f ./keycloak/keycloak.yaml``

6. Deploy Mongo:
``oc new-app --name=mongodb --docker-image=mongo:5.0 --env=MONGO_INITDB_DATABASE=todo``

