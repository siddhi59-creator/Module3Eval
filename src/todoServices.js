import axiosInstance from './axiosInstance';

// Fetch all todos
export const getTodos = async () => {
  try {
    const response = await axiosInstance.get('/todos');
    return response.data;
  } catch (error) {
    console.error('Error fetching todos:', error);
    return [];
  }
};

// Fetch todo by ID
export const getTodoById = async (id) => {
  try {
    const response = await axiosInstance.get(`/todos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching todo with id ${id}:`, error);
    return null;
  }
};