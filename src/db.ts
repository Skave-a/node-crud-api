import { v4 as uuidv4 } from "uuid";

export interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

const users: User[] = [];

export const getAllUsers = () => users;

export const getUserByID = (id: string) => users.find((user) => user.id === id);

export const createUser = (
  username: string,
  age: number,
  hobbies: string[]
) => {
  const newUser: User = { id: uuidv4(), username, age, hobbies };
  users.push(newUser);

  return newUser;
};

export const updateUser = (id: string, data: Omit<User, "id">) => {
  const user = getUserByID(id);
  if (user) {
    Object.assign(user, data);
    return user;
  }
  return null;
};

export const deleteUser = (id: string) => {
  const index = users.findIndex((user) => user.id === id);

  return !!users.splice(index, 1);
};
