// src/app/page.js
import TodoList from '../components/TodoList';

export default function Home() {
  return (
    <main className="container mx-auto py-8 px-4">
      <TodoList />
    </main>
  );
}