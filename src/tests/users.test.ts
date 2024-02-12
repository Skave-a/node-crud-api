import { server } from '../index';
import { handleGetUsers, handleGetUser, handleCreateUser, handleUpdateUser, handleDeleteUser } from '../router/Router';

const PORT = 3001;

describe('API Tests', () => {
  let serverInstance;

  beforeAll(() => {
    server.close();

    process.env.PORT = String(PORT);

    serverInstance = server.listen(PORT);
  });

  afterAll((done) => {
    serverInstance.close();
    done();
  });

  beforeEach(() => {
    server.on('request', (req, res) => {
      if (req.url === '/api/users/' && req.method === 'GET') {
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
    });
  });

  afterEach(() => {
    server.removeAllListeners('request');
  });

  it('should return an empty array when getting all users', async () => {
    const response = await fetch(`http://localhost:${PORT}/api/users`);
    const users = await response.json();

    expect(response.status).toEqual(200);
    expect(users).toEqual([]);
  });

  it('should create a new user and return the created user', async () => {
    const newUser = {
      username: 'Skave',
      age: 20,
      hobbies: ['reading', 'dancing']
    };

    const response = await fetch(`http://localhost:${PORT}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    });

    const createdUser = await response.json();

    expect(response.status).toEqual(201);
    expect(createdUser).toMatchObject(newUser);
    expect(createdUser.id).toBeDefined();
  });

  it('should return the user with the specified id', async () => {
    const user = {
      id: '1f691d67-67e0-4247-bb1d-931a516f595b',
      username: 'Skave',
      age: 20,
      hobbies: ['reading', 'dancing']
    };

    const response = await fetch(`http://localhost:${PORT}/api/users/${user.id}`);
    const foundUser = await response.json();

    expect(response.status).toEqual(200);
    expect(foundUser).toMatchObject(user);
  });

  it('should update the user with the specified id', async () => {
    const user = {
      id: '1f691d67-67e0-4247-bb1d-931a516f595b',
      username: 'Skave',
      age: 20,
      hobbies: ['reading', 'dancing']
    };

    const response = await fetch(`http://localhost:${PORT}/api/users/${user.id}`);
    const notFoundResponse = await response.json();

    expect(response.status).toEqual(404);
    expect(notFoundResponse.message).toEqual('User not found');
  });
});
