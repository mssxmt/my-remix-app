import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { FC } from "react";
import invariant from "tiny-invariant";

import { getTodo, updateTodo } from "~/models/todo.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.todoId);
  const todo = await getTodo(params.todoId);
  invariant(todo);
  return json({ todo });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const title = formData.get("title");
  const deadline = formData.get("deadline");
  const isDone = formData.get("isDone") === "done";

  const errors = {
    title: title ? null : "タイトルは必須です",
    deadline: deadline ? null : "期限は必須です",
  };

  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);

  if (hasErrors) return json(errors);

  invariant(params.todoId);
  invariant(typeof title === "string");
  invariant(typeof deadline === "string");

  await updateTodo(params.todoId, { title, deadline, isDone });

  return redirect("/todos");
};

const EditTodo: FC = () => {
  const { todo } = useLoaderData<typeof loader>();
  const errors = useActionData<typeof action>();

  return (
    <>
      <h2>編集画面</h2>
      <Form method="POST">
        <div>
          <label>
            タイトル：
            {errors?.title ? (
              <p style={{ color: "red" }}>{errors.title}</p>
            ) : null}
            <input type="text" name="title" defaultValue={todo.title} />
          </label>
        </div>
        <div>
          <label>
            期限：
            {errors?.deadline ? (
              <p style={{ color: "red" }}>{errors.deadline}</p>
            ) : null}
            <input type="date" name="deadline" defaultValue={todo.deadline} />
          </label>
        </div>
        <div>
          <input
            id="done"
            type="radio"
            name="isDone"
            value="done"
            defaultChecked={todo.isDone}
          />
          <label htmlFor="done">完了</label>
          <input
            id="notDone"
            type="radio"
            name="isDone"
            value="notDone"
            defaultChecked={!todo.isDone}
          />
          <label htmlFor="notDone">未着手</label>
        </div>
        <div>
          <button type="submit">更新</button>
        </div>
      </Form>
    </>
  );
};

export default EditTodo;
