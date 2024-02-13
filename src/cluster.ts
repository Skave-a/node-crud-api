import cluster, { Worker } from 'cluster';
import * as dotenv from 'dotenv';
import http, { IncomingMessage, ServerResponse } from 'http';
import os from 'os';
import { handleCreateUser, handleDeleteUser, handleGetUser, handleGetUsers, handleUpdateUser } from './router/Router';

dotenv.config({ path: __dirname + '/.env' });

const numCPUs = os.cpus().length;
const PORT = parseInt(process.env.PORT || '4000', 10);

if (cluster.isPrimary) {
  for (let i = 0; i < numCPUs - 1; i++) {
    cluster.fork();
  }

  const workers: Worker[] = Object.values(cluster.workers || {}) as Worker[];

  let nextWorkerIndex = 0;

  const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
    const worker = workers[nextWorkerIndex];
    worker.send({ type: 'request', req, res });
    nextWorkerIndex = (nextWorkerIndex + 1) % workers.length;
  });

  server.listen(PORT, () => {
    console.log(`Load balancer is listening on port ${PORT}`);
  });
} else {
  const workerPort = PORT + (cluster.worker?.id ?? 0);
  const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
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
      res.end(JSON.stringify({ message: 'server err' }));
    }
  });

  server.listen(workerPort, () => {
    console.log(`Worker ${cluster.worker?.id ?? 0} is running on port ${workerPort}`);
  });
}
