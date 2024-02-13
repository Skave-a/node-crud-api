import { IncomingMessage, ServerResponse, createServer } from 'node:http';
import { handleGetUsers, handleGetUser, handleCreateUser, handleUpdateUser, handleDeleteUser } from './router/Router';
import * as dotenv from 'dotenv'

dotenv.config()

// Constants
const PORT = process.env.PORT || 3001;

export const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  try {
    if (req.url === '/api/users' && req.method === 'GET') {
      handleGetUsers(req, res);
    } else if (req.url?.startsWith('/api/users/') && req.method === 'GET') {
      handleGetUser(req, res);
    } else if (req.url === '/api/users' && req.method === 'POST') {
      handleCreateUser(req, res);
    } else if (req.url?.startsWith('/api/users/') && req.method === 'PUT') {
      handleUpdateUser(req, res);
    } else if (req.url?.startsWith('/api/users/') && req.method === 'DELETE') {
      handleDeleteUser(req, res);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 404;
      res.end(JSON.stringify({ message: 'Route not found' }));
    }
  } catch (err) {
    console.error(err);
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 500;
    res.end(JSON.stringify({ message: 'Внутренняя ошибка сервера' }));
  }
});

server.listen(PORT, () => {
  console.log(`Server is running at ${PORT}/`);
});
