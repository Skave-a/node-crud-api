import dotenv from 'dotenv';
import { IncomingMessage, ServerResponse, createServer } from 'node:http';
import { v4 as uuidv4 } from "uuid";

dotenv.config();

// Constants
const PORT = process.env.PORT || 3001;

// Placeholder data for users
const users: { id: string; username: string; age: number; hobbies: string[] }[] = [];


const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  if (req.url === '/api/users' && req.method === 'GET') {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify(users));
  } else if (req.url?.startsWith('/api/users/') && req.method === 'GET') {
    const userId = req.url.split('/')[3];
    const user = users.find((u) => u.id === userId);

    if (user) {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify(user));
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 404;
      res.end(JSON.stringify({ message: 'User not found' }));
    }
  } else if (req.url === '/api/users' && req.method === 'POST') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      const newUser = JSON.parse(body);

      if (!newUser.username || !newUser.age) {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 400;
        res.end(JSON.stringify({ message: 'Username and age are required' }));
      } else {
        const generatedId = uuidv4();
        const createdUser = { id: generatedId, ...newUser, hobbies: newUser.hobbies || [] };
        users.push(createdUser);

        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 201;
        res.end(JSON.stringify(createdUser));
      }
    });
  } else if (req.url?.startsWith('/api/users/') && req.method === 'PUT') {
    const userId = req.url.split('/')[3];
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex !== -1) {
      let body = '';

      req.on('data', (chunk) => {
        body += chunk;
      });

      req.on('end', () => {
        const updatedUser = JSON.parse(body);

        if (!updatedUser.username || !updatedUser.age) {
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 400;
          res.end(JSON.stringify({ message: 'Username and age are required' }));
        } else {
          users[userIndex] = { ...users[userIndex], ...updatedUser, hobbies: updatedUser.hobbies || [] };

          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          res.end(JSON.stringify(users[userIndex]));
        }
      });
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 404;
      res.end(JSON.stringify({ message: 'User not found' }));
    }
  } else if (req.url?.startsWith('/api/users/') && req.method === 'DELETE') {
    const userId = req.url.split('/')[3];
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex !== -1) {
      users.splice(userIndex, 1);

      res.statusCode = 204;
      res.end();
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 404;
      res.end(JSON.stringify({ message: 'User not found' }));
    }
  } else {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 404;
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`Server is running at ${PORT}/`);
});


