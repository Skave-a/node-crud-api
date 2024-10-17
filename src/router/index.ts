import { IncomingMessage, ServerResponse } from "http";

import {
  addUser,
  getUser,
  getUsers,
  removeUser,
  updateUser,
} from "../controllers";

const userRoutes = (req: IncomingMessage, res: ServerResponse) => {
  const { method, url } = req;

  if (method === "GET" && url === "/api/users") {
    return getUsers(req, res);
  }

  if (method === "GET" && url?.startsWith("/api/users/")) {
    return getUser(req, res);
  }

  if (method === "POST" && url === "/api/users") {
    return addUser(req, res);
  }

  if (method === "PUT" && url?.startsWith("/api/users/")) {
    return updateUser(req, res);
  }

  if (method === "DELETE" && url?.startsWith("/api/users/")) {
    return removeUser(req, res);
  }

  res.writeHead(404);
  res.end("Resource not found");
};

export default userRoutes;
