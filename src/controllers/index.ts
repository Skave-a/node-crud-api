import { IncomingMessage, ServerResponse } from "http";
import {
  getAllUsers,
  getUserByID,
  updateUser as updateUserInDB,
  deleteUser,
  createUser,
} from "../db";
import { parseBody, validateUUID } from "../utils";
import { User } from "../types";

export const getUsers = async (req: IncomingMessage, res: ServerResponse) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(getAllUsers()));
};

export const getUser = async (req: IncomingMessage, res: ServerResponse) => {
  const userId = req.url?.split("/").pop();
  if (!validateUUID(userId)) {
    res.writeHead(400);
    res.end("Invalid UUID");
    return;
  }

  const user = getUserByID(userId);
  if (!user) {
    res.writeHead(404);
    res.end("User not found");
    return;
  }

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(user));
};

export const addUser = async (req: IncomingMessage, res: ServerResponse) => {
  const body = (await parseBody(req)) as User;
  const { username, age, hobbies } = body;

  if (!username || typeof age !== "number" || !Array.isArray(hobbies)) {
    res.writeHead(400);
    res.end("Invalid request body - body does not contain required fields");
    return;
  }

  const newUser = createUser(username, age, hobbies);

  res.writeHead(201, { "Content-Type": "application/json" });
  res.end(JSON.stringify(newUser));
};

export const updateUser = async (req: IncomingMessage, res: ServerResponse) => {
  const userId = req.url?.split("/").pop();
  if (!validateUUID(userId)) {
    res.writeHead(400);
    res.end("Invalid UUID");
    return;
  }

  const body = (await parseBody(req)) as User;
  const { username, age, hobbies } = body;

  const updatedUser = updateUserInDB(userId, { username, age, hobbies });
  if (!updatedUser) {
    res.writeHead(404);
    res.end("User not found");
    return;
  }

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(updatedUser));
};

export const removeUser = async (req: IncomingMessage, res: ServerResponse) => {
  const userId = req.url?.split("/").pop();
  if (!validateUUID(userId)) {
    res.writeHead(400);
    res.end("Invalid UUID");
    return;
  }

  const isDeleted = deleteUser(userId);
console.log('isDeleted', isDeleted);

  if (!isDeleted) {
    res.writeHead(404);
    console.log('"User not found" :>> ', "User not found");
    res.end("User not found");
    return;
  }

  res.writeHead(204, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "User successfully removed" }));
};
