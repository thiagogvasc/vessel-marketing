import React from "react";
import { Task as TaskType } from "../types";
import TaskDialog from "../components/TaskDialog/TaskDialog";
import { useDeleteKanbanTask } from "../hooks/react-query/database_view";
import { useUpdateTask } from "../hooks/react-query/database_view";
import { TaskCommentsContainer } from "./TaskCommentsContainer";
import { TaskPropertiesContainer } from "./TaskPropertiesContainer";

export interface TaskWithId extends TaskType {
  id: string;
}

interface TaskDialogContainerProps {
  databaseId: string;
  viewId: string;
  task: TaskWithId;
  open: boolean;
  dialogClosed?: () => void;
}

export const TaskDialogContainer = ({
  task,
  open,
  databaseId,
  viewId,
  dialogClosed,
}: TaskDialogContainerProps) => {
  const updateTaskMutation = useUpdateTask(task.database_id, viewId);
  const deleteTaskMutation = useDeleteKanbanTask(task.database_id, viewId);

  const handleTaskUpdated = async (title: string, description: string) => {
    await updateTaskMutation.mutateAsync({
      id: task.id,
      updatedTask: { title, description },
    });
  };

  const handleTaskDeleted = async () => {
    await deleteTaskMutation.mutateAsync(task);
  };

  const handleTaskDialogClose = () => dialogClosed?.();
  return (
    <TaskDialog
      readOnly={false}
      task={task}
      TaskCommentsComponent={
        <TaskCommentsContainer database_id={databaseId} task_id={task.id} />
      }
      TaskPropertiesComponent={
        <TaskPropertiesContainer
          database_id={databaseId}
          taskProperties={task.properties}
        />
      }
      open={open}
      onClose={handleTaskDialogClose}
      onSave={handleTaskUpdated}
      onDelete={handleTaskDeleted}
    />
  );
};
