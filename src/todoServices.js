import axiosInstance from "./axiosInstance.js";

// Fetch all todos
export const getTodos = async () => {
  const response = await axiosInstance.get("/todos");
  return response.data;
};

// Fetch todo by ID
export const getTodoById = async (id) => {
  const response = await axiosInstance.get(`/todos/${id}`);
  return response.data;
};