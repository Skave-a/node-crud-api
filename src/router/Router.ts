import { IncomingMessage, ServerResponse } from 'node:http';
import { v4 as uuidv4, validate as validateUuid } from 'uuid';

// Placeholder data for users
const users: { id: string; username: string; age: number; hobbies: string[] }[] = [];

export function handleGetUsers(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200;
  res.end(JSON.stringify(users));
}

export function handleGetUser(req: IncomingMessage, res: ServerResponse) {
  const userId = req.url?.split('/')[3];

  if (userId && !validateUuid(userId)) {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 400;
    res.end(JSON.stringify({ message: 'Invalid userId' }));
  } else {
    const user = users.find((u) => u.id === userId);

    if (user) {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify({ ...user, id: undefined }));
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 404;
      res.end(JSON.stringify({ message: 'User not found' }));
    }
  }
}

export function handleCreateUser(req: IncomingMessage, res: ServerResponse) {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', () => {
    const newUser = JSON.parse(body);

    if (!newUser.username || !newUser.age || !newUser.hobbies) {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 400;
      res.end(JSON.stringify({ message: 'Username, age, and hobbies are required' }));
    } else {
      const generatedId = uuidv4();
      const createdUser = { id: generatedId, ...newUser };
      users.push(createdUser);

      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 201;
      res.end(JSON.stringify(createdUser));
    }
  });
}

export function handleUpdateUser(req: IncomingMessage, res: ServerResponse) {
  const userId = req.url?.split('/')[3];
  const userIndex = users.findIndex((u) => u.id === userId);

  if (userId !== undefined && !validateUuid(userId)) {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 400;
    res.end(JSON.stringify({ message: 'Invalid userId' }));
  } else if (userIndex !== -1) {
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
}

export function handleDeleteUser(req: IncomingMessage, res: ServerResponse) {
  const userId = req.url?.split('/')[3];

  if (userId !== undefined && !validateUuid(userId)) {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 400;
    res.end(JSON.stringify({ message: 'Invalid userId' }));
  } else {
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
  }
}
