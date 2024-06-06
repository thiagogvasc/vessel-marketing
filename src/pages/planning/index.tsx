import React from 'react';
import KanbanBoard from '../../components/KanbanBoard';
import "@/styles/KanbanBoard.module.css"
interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
}

const tasks: Task[] = [
  { id: '1', title: 'Task 1', description: 'Description 1', status: 'todo' },
  { id: '2', title: 'Task 2', description: 'Description 2', status: 'in_progress' },
  { id: '3', title: 'Task 3', description: 'Description 3', status: 'done' },
];


export default function Planning() {
  return (
    <div>
      <h1>Kanban Board</h1>
      <KanbanBoard tasks={tasks} />
    </div>
  );
}
