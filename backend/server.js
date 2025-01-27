const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('express-jwt'); // Cambiado para importar correctamente
const jwksRsa = require('jwks-rsa');

const app = express();

// Variables de entorno
const PORT = process.env.PORT || 4000;
const KEYCLOAK_DOMAIN = process.env.KEYCLOAK_DOMAIN || 'http://localhost:8080';
const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM || 'demo';
const CLIENT_ID = process.env.CLIENT_ID;

// Configuración de Keycloak
const JWKS_URI = `${KEYCLOAK_DOMAIN}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/certs`;
const ISSUER = `${KEYCLOAK_DOMAIN}/realms/${KEYCLOAK_REALM}`;

// Middleware para la autenticación
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

// Middleware para procesar el cuerpo de las solicitudes
app.use(bodyParser.json());
app.use(cors());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://mongodb:27017/todo', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});

// Definición del esquema y modelo de tareas
const TaskSchema = new mongoose.Schema({ text: String });
const Task = mongoose.model('Task', TaskSchema);

// Rutas protegidas con autenticación
app.get('/api/tasks', checkJwt, async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching tasks' });
  }
});

app.post('/api/tasks', checkJwt, async (req, res) => {
  try {
    const task = new Task({ text: req.body.text });
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).send({ message: 'Error creating task' });
  }
});

app.delete('/api/tasks/:id', checkJwt, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.sendStatus(204); // No content
  } catch (error) {
    res.status(500).send({ message: 'Error deleting task' });
  }
});

// Endpoint de prueba para verificar la autenticación
app.get('/api/protected', checkJwt, (req, res) => {
  res.json({
    message: 'Access granted to protected resource!',
    user: req.user, // Información del token
  });
});

// Middleware para manejar errores de autenticación
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    // Token no proporcionado o inválido
    return res.status(401).send({ message: 'Unauthorized access - Invalid token' });
  }
  next(err);
});

// Iniciar el servidor
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));