import React, { useState } from 'react';
import { useAddTask } from '../hooks/useTasks';
import { Task } from '../types';

interface TaskFormProps {
  boardId: string;
}

const AddTaskForm: React.FC<TaskFormProps> = ({ boardId }) => {
  const addTaskMutation = useAddTask(boardId);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [status, setStatus] = useState<Task['status']>('To Do');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTaskMutation.mutateAsync({
      board_id: boardId,
      title,
      description,
      priority,
      status,
      columnTitle: status,
      assigned_to: '', // Add assigned_to if necessary
    }).then(res => {
      console.warn('mutated')
    });
    setTitle('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Title:
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
      </div>
      <div>
        <label>
          Description:
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </label>
      </div>
      <div>
        <label>
          Priority:
          <select value={priority} onChange={(e) => setPriority(e.target.value as Task['priority'])}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Status:
          <select value={status} onChange={(e) => setStatus(e.target.value as Task['status'])}>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </label>
      </div>
      <button type="submit">Add Task</button>
    </form>
  );
};

export default AddTaskForm;
