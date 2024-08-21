import React from 'react';
import { Task, TaskComment, Task as TaskType } from '../types';
import { useDeleteTask, useGetDatabaseWithTasks, useUpdateTask } from '../hooks/useTasks';
import TaskDialog from '../components/TaskDialog';

export interface TaskWithId extends TaskType {
  id: string;
}

interface TaskDialogContainerProps {
  databaseId: string;
  viewName: string;
  task: TaskWithId;
  open: boolean;
  dialogClosed?: () => void;
}

export const TaskDialogContainer = ({ task, open, databaseId, viewName, dialogClosed }: TaskDialogContainerProps) => {
  const { data: databaseWithTasks } = useGetDatabaseWithTasks(databaseId);
  const updateTaskMutation = useUpdateTask(task.database_id, viewName);
  const deleteTaskMutation = useDeleteTask(task.database_id, viewName);
  
  const comments: TaskComment[] = [
    {
      author: 'thiago',
      text: 'my commetn',
      created_at: 'today',
      id: '1'
    },
    {
      author: 'thiago2',
      text: 'my commetn2',
      created_at: 'today2',
      id: '2'
    }, 
    {
      author: 'thiago3',
      text: 'my commetn33333333',
      created_at: 'today3333',
      id: '3'
    },
  ]
  task.comments = comments; //

  const handleTaskUpdated = async (updatedTask: TaskWithId) => {
    await updateTaskMutation.mutateAsync({ id: updatedTask.id, updatedTask });
  }

  const handleTaskDeleted = async (taskToDelete: Task) => {
    await deleteTaskMutation.mutateAsync(taskToDelete)
  }

  const handleTaskDialogClose = () => dialogClosed?.();

  const handleCommentAdded = () => {
    
  };

  return (
    <TaskDialog
      readOnly={false}
      task={task}
      open={open}
      onClose={handleTaskDialogClose}
      onSave={handleTaskUpdated}
      onDelete={handleTaskDeleted}
      onCommentAdded={handleCommentAdded}
    />
  );
};