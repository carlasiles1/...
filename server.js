const jsonServer = require('json-server');
const path = require('path');
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, '../db/db.json'));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use('/api', router); // Ruta base para las APIs

// Personalizar rutas (opcional)
server.post('/api/posts', (req, res, next) => {
  req.body.id = Date.now(); // Generar ID único
  next();
});

server.post('/api/scores', (req, res, next) => {
  req.body.id = Date.now();
  req.body.createdAt = new Date().toISOString();
  next();
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`JSON Server está corriendo en http://localhost:${PORT}`);
});