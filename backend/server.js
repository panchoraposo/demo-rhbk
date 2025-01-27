const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('express-jwt'); // Importar express-jwt
const jwksRsa = require('jwks-rsa');

const app = express();
// Env variables
const PORT = process.env.PORT || 4000;
const KEYCLOAK_DOMAIN = process.env.KEYCLOAK_DOMAIN || 'http://localhost:8080';
const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM || 'demo';
const CLIENT_ID = process.env.CLIENT_ID;

// Keycloak configuration
const JWKS_URI = `${KEYCLOAK_DOMAIN}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/certs`;
const ISSUER = `${KEYCLOAK_DOMAIN}/realms/${KEYCLOAK_REALM}`;

// Middleware for authentication
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: JWKS_URI,
  }),
  audience: CLIENT_ID,
  issuer: ISSUER,
  algorithms: ['RS256'],
});

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://mongodb:27017/todo');

// Task Schema and Model
const TaskSchema = new mongoose.Schema({ text: String });
const Task = mongoose.model('Task', TaskSchema);

// Secured API Endpoints
app.get('/api/tasks', checkJwt, async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.post('/api/tasks', checkJwt, async (req, res) => {
  const task = new Task({ text: req.body.text });
  await task.save();
  res.json(task);
});

app.delete('/api/tasks/:id', checkJwt, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

// Test endpoint to verify authentication
app.get('/api/protected', checkJwt, (req, res) => {
  res.json({
    message: 'Access granted to protected resource!',
    user: req.user, // Information from the token
  });
});

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));