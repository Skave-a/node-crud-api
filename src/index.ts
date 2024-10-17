import http from "http";
import cluster from "cluster";
import {
  getUsers,
  getUser,
  addUser,
  updateUser,
  removeUser,
} from "./controllers";
import { parse } from "url";

const PORT =
  parseInt(process.env.PORT || "4000", 10) + (cluster.worker?.id || 0);

const requestHandler = (
  req: http.IncomingMessage,
  res: http.ServerResponse
) => {
  const url = parse(req.url || "", true);
  const method = req.method;

  if (url.pathname?.startsWith("/api/users")) {
    if (method === "GET" && url.pathname === "/api/users") {
      return getUsers(req, res);
    } else if (method === "GET" && url.pathname?.startsWith("/api/users/")) {
      return getUser(req, res);
    } else if (method === "POST" && url.pathname === "/api/users") {
      return addUser(req, res);
    } else if (method === "PUT" && url.pathname?.startsWith("/api/users/")) {
      return updateUser(req, res);
    } else if (method === "DELETE" && url.pathname?.startsWith("/api/users/")) {
      return removeUser(req, res);
    }
  }

  res.writeHead(404);
  res.end("Not Found");
};

export const server = http.createServer(requestHandler);
server.listen(PORT, () => {
  console.log(`Worker ${process.pid} listening on port ${PORT}`);
});
