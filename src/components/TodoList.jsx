'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addTodo, toggleTodo, deleteTodo, editTodo, clearCompleted, selectTodos } from '../todos/todoSlice';

export default function TodoList() {
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [isClient, setIsClient] = useState(false);
  
  const todos = useSelector(selectTodos);
  const dispatch = useDispatch();

  // Fix hydration mismatch by only rendering the component after client-side hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (newTodo.trim()) {
      dispatch(addTodo(newTodo.trim()));
      setNewTodo('');
    }
  };

  const handleEdit = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const handleSaveEdit = () => {
    if (editText.trim() && editingId !== null) {
      dispatch(editTodo({ id: editingId, text: editText.trim() }));
      setEditingId(null);
    }
  };

  const handleClearCompleted = () => {
    dispatch(clearCompleted());
  };

  const inputValue = newTodo || '';

  // Show loading state until client-side hydration is complete
  if (!isClient) {
    return <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold text-center mb-4">Todo List</h1>
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded mb-6"></div>
        <div className="h-16 bg-gray-200 rounded mb-4"></div>
      </div>
    </div>;
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold text-center mb-4">Todo List With Redux</h1>
      
      <form onSubmit={handleAddTodo} className="mb-6">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-200"
          >
            Add
          </button>
        </div>
      </form>

      {todos.length === 0 ? (
        <p className="text-gray-500 text-center py-4">Your todo list is empty. Add a task to get started!</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {todos.map((todo) => (
            <li key={todo.id} className="py-3">
              {editingId === todo.id ? (
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex w-full sm:w-auto gap-2 mt-2 sm:mt-0">
                    <button
                      onClick={handleSaveEdit}
                      className="flex-1 sm:flex-none bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md transition duration-200"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex-1 sm:flex-none bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-2 rounded-md transition duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => dispatch(toggleTodo(todo.id))}
                      className="h-5 w-5 text-blue-500 rounded"
                    />
                    <span 
                      className={`${
                        todo.completed ? 'line-through text-gray-400' : 'text-gray-800'
                      } break-words`}
                    >
                      {todo.text}
                    </span>
                  </div>
                  <div className="flex space-x-2 justify-end">
                    <button
                      onClick={() => handleEdit(todo)}
                      className="text-blue-500 hover:text-blue-700 px-2 py-1"
                      aria-label="Edit todo"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => dispatch(deleteTodo(todo.id))}
                      className="text-red-500 hover:text-red-700 px-2 py-1"
                      aria-label="Delete todo"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      
      {todos.length > 0 && (
        <div className="mt-4 flex flex-col sm:flex-row sm:justify-between items-center text-sm text-gray-500 gap-2">
          <span>{todos.filter(todo => !todo.completed).length} items left</span>
          <button
            onClick={handleClearCompleted}
            className="text-gray-500 hover:text-gray-700"
          >
            Clear completed
          </button>
        </div>
      )}
    </div>
  );
}