import { ActionFunctionArgs, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import { deleteTodo } from "~/models/todo.server";

export const action = async ({ params }: ActionFunctionArgs) => {
  invariant(params.todoId);
  await deleteTodo(params.todoId);
  return redirect("/todos");
};
