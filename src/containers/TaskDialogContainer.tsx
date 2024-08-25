import React from "react";
import { Task, Task as TaskType } from "../types";
import TaskDialog from "../components/TaskDialog/TaskDialog";
import { useDeleteKanbanTask } from "../hooks/react-query/database_view";
import { useUpdateTask } from "../hooks/react-query/database_view";
import { TaskCommentsContainer } from "./TaskCommentsContainer";
import { TaskPropertiesContainer } from "./TaskPropertiesContainer";

interface TaskDialogContainerProps {
  databaseId: string;
  viewId: string;
  task: Task;
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
  const updateTaskMutation = useUpdateTask(task.database_id, task.id, viewId);
  const deleteTaskMutation = useDeleteKanbanTask(task.database_id, viewId);

  const handleTaskUpdated = async (changes: Partial<Task>) => {
    await updateTaskMutation.mutateAsync({
      id: task.id,
      changes,
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
          task_id={task.id}
          database_id={databaseId}
          view_id={viewId}
          taskProperties={task.properties}
        />
      }
      open={open}
      onClose={handleTaskDialogClose}
      onUpdate={handleTaskUpdated}
      onDelete={handleTaskDeleted}
    />
  );
};
