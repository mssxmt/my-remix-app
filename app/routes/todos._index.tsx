import { json } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { FC } from "react";

import { getTodos } from "~/models/todo.server";

export const loader = async () => {
  return json({ todos: await getTodos() });
};

const Todos: FC = () => {
  const { todos } = useLoaderData<typeof loader>();

  return (
    <>
      <h2>Todo一覧画面</h2>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <p>タイトル：{todo.title}</p>
            <p>期限：{todo.deadline}</p>
            <p>進捗：{todo.isDone ? "完了" : "未着手"}</p>
            <Link to={`${todo.id}/edit`}>編集</Link>
            <Form action={`${todo.id}/delete`} method="post">
              <button type="submit">削除</button>
            </Form>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Todos;
