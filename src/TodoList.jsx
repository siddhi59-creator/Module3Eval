import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTodoById} from "../api/todoService.js";

const TodoList = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>Todo List</h1>

      {todos.slice(0, 20).map((todo) => (
        <div key={todo.id} style={{ marginBottom: "10px" }}>
          <Link to={`/todo/${todo.id}`}>
            <strong>{todo.title}</strong>
          </Link>
          <p>Status: {todo.completed ? " Completed" : " Pending"}</p>
        </div>
      ))}
    </div>
  );
};

export default TodoList;