import React, { useState } from 'react';
import styles from "../styles/KanbanBoard.module.css"

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
}

interface KanbanBoardProps {
  tasks: Task[];
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks }) => {
  const [taskList, setTaskList] = useState<Task[]>(tasks);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDrop = (e: React.DragEvent, newStatus: Task['status']) => {
    const taskId = e.dataTransfer.getData('taskId');
    const updatedTasks = taskList.map((task) =>
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    setTaskList(updatedTasks);
  };

  const allowDrop = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const renderTasks = (status: Task['status']) => {
    return taskList
      .filter((task) => task.status === status)
      .map((task) => (
        <div
          key={task.id}
          draggable
          onDragStart={(e) => handleDragStart(e, task.id)}
          className="task"
        >
          <h3>{task.title}</h3>
          <p>{task.description}</p>
        </div>
      ));
  };
  
  return (
    <div className={styles.kanbanBoard}>
      <div
        className={styles.kanbanColumn}
        onDrop={(e) => handleDrop(e, 'todo')}
        onDragOver={allowDrop}
      >
        <h2>To Do </h2>
        {renderTasks('todo')}
      </div>
      <div
        className={styles.kanbanColumn}
        onDrop={(e) => handleDrop(e, 'in_progress')}
        onDragOver={allowDrop}
      >
        <h2>In Progress</h2>
        {renderTasks('in_progress')}
      </div>
      <div
        className={styles.kanbanColumn}
        onDrop={(e) => handleDrop(e, 'done')}
        onDragOver={allowDrop}
      >
        <h2>Done</h2>
        {renderTasks('done')}
      </div>
    </div>
  );
};

export default KanbanBoard;
