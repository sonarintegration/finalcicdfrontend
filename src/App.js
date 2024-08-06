import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentTodo, setCurrentTodo] = useState({});

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/todos`);
      if (Array.isArray(response.data)) {
        setTodos(response.data);
      } else {
        console.error('Invalid response format:', response.data);
        setTodos([]); // Set todos to an empty array
      }
    } catch (error) {
      console.error('Error fetching todos:', error.message);
      setTodos([]); // Set todos to an empty array
    }
  };

  const handleAddOrUpdateTodo = async () => {
    if (isEditing) {
      // Update todo
      try {
        const response = await axios.put(`${process.env.REACT_APP_API_URL}/todos/${currentTodo.id}`, {
          title,
          description,
          completed: currentTodo.completed,
        });
        if (response.status >= 200 && response.status < 300) {
          console.log('Todo updated:', response.data);
          setTodos(todos.map(todo => (todo.id === currentTodo.id ? response.data : todo)));
          setTitle('');
          setDescription('');
          setIsEditing(false);
          setCurrentTodo({});
        } else {
          throw new Error(`Request failed with status ${response.status}`);
        }
      } catch (error) {
        console.error('Error updating todo:', error.message);
      }
    } else {
      // Add new todo
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/todos`, {
          title,
          description,
          completed: false,
        });
        if (response.status >= 200 && response.status < 300) {
          console.log('Todo created:', response.data);
          setTodos([...todos, response.data]);
          setTitle('');
          setDescription('');
        } else {
          throw new Error(`Request failed with status ${response.status}`);
        }
      } catch (error) {
        console.error('Error adding todo:', error.message);
      }
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/todos/${id}`);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error.message);
    }
  };

  const handleEditTodo = (todo) => {
    setIsEditing(true);
    setTitle(todo.title);
    setDescription(todo.description);
    setCurrentTodo(todo);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setTitle('');
    setDescription('');
    setCurrentTodo({});
  };

  const toggleCompleteTodo = async (todo) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/todos/${todo.id}`, {
        title: todo.title,
        description: todo.description,
        completed: !todo.completed,
      });
      if (response.status >= 200 && response.status < 300) {
        console.log('Todo updated:', response.data);
        setTodos(todos.map(t => (t.id === todo.id ? response.data : t)));
      } else {
        throw new Error(`Request failed with status ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating todo:', error.message);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Todo App</h1>
      </header>
      <main className="main-content">
        <div className="container">
          <h2>Todo List</h2>
          <div className="add-todo">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
            <div className="add-todo-actions">
              <button onClick={handleAddOrUpdateTodo}>
                {isEditing ? 'Update Todo' : 'Add Todo'}
              </button>
              {isEditing && (
                <button onClick={handleCancelEdit} className="cancel-edit">
                  Cancel
                </button>
              )}
            </div>
          </div>
          <ul>
            {todos.map(todo => (
              <li key={todo.id} className="todo-item">
                <h3>{todo.title}</h3>
                <p>{todo.description}</p>
                <div className="todo-actions">
                  <button onClick={() => handleEditTodo(todo)}>Edit</button>
                  <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
                  <button onClick={() => toggleCompleteTodo(todo)}>
                    {todo.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <footer className="footer">
        <p>&copy; 2024 Todo App</p>
      </footer>
    </div>
  );
}

export default App;
