'use client';

import { createSlice } from '@reduxjs/toolkit';

const loadTodosFromStorage = () => {
  if (typeof window !== 'undefined') {
    try {
      const storedTodos = localStorage.getItem('todos');
      return storedTodos ? JSON.parse(storedTodos) : [];
    } catch (error) {
      console.error('Error loading todos from localStorage:', error);
      return [];
    }
  }
  return [];
};

const saveTodosToStorage = (todos) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('todos', JSON.stringify(todos));
    } catch (error) {
      console.error('Error saving todos to localStorage:', error);
    }
  }
};

// Initial state
const initialState = {
  todos: loadTodosFromStorage(),
};

// create Slice
export const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    // Action: newTodo
    addTodo: (state, action) => {
      const text = action.payload || ''; // ป้องกันค่า undefined
      if (!text.trim()) return; // ไม่เพิ่ม todo ว่าง
      
      const newTodo = {
        id: Date.now(),
        text,
        completed: false,
      };
      state.todos.push(newTodo);
      saveTodosToStorage(state.todos);
    },
    
    // Action : isCompleted
    toggleTodo: (state, action) => {
      const todoId = action.payload;
      if (!todoId) return; // ป้องกันค่า undefined หรือ null
      
      const todo = state.todos.find(todo => todo.id === todoId);
      if (todo) {
        todo.completed = !todo.completed;
        saveTodosToStorage(state.todos);
      }
    },
    
    // Action : delete Todo
    deleteTodo: (state, action) => {
      const todoId = action.payload;
      if (!todoId) return; // ป้องกันค่า undefined หรือ null
      
      state.todos = state.todos.filter(todo => todo.id !== todoId);
      saveTodosToStorage(state.todos);
    },

    // Action : edit Todo
    editTodo: (state, action) => {
      const { id, text } = action.payload;
      if (!id || !text || !text.trim()) return; 
      
      const todo = state.todos.find(todo => todo.id === id);
      if (todo) {
        todo.text = text.trim();
        saveTodosToStorage(state.todos);
      }
    },
    
    // Action : clear completed todos
    clearCompleted: (state) => {
      state.todos = state.todos.filter(todo => !todo.completed);
      saveTodosToStorage(state.todos);
    },
  },
});

export const { addTodo, toggleTodo, deleteTodo, editTodo, clearCompleted } = todosSlice.actions;
export const selectTodos = (state) => state.todos?.todos || [];
export default todosSlice.reducer;