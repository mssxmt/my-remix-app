import { Todo } from "@prisma/client";

import { prisma } from "~/db.server";

export const getTodos = () => {
  return prisma.todo.findMany();
};

export const getTodo = (id: string) => {
  return prisma.todo.findUnique({ where: { id } });
};

export const createTodo = (todo: Pick<Todo, "title" | "deadline">) => {
  return prisma.todo.create({ data: todo });
};

export const updateTodo = (
  id: string,
  todo: Pick<Todo, "title" | "deadline" | "isDone">,
) => {
  return prisma.todo.update({
    where: { id },
    data: todo,
  });
};

export const deleteTodo = (id: string) => {
  return prisma.todo.delete({ where: { id } });
};
