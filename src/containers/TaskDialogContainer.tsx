import React from "react";
import { Task, Task as TaskType } from "../types";
import TaskDialog from "../components/TaskDialog/TaskDialog";
import { useDeleteKanbanTask } from "../hooks/react-query/database_view";
import { useUpdateTask } from "../hooks/react-query/database_view";
import { TaskCommentsContainer } from "./TaskCommentsContainer";
import { TaskPropertiesContainer } from "./TaskPropertiesContainer";

interface TaskDialogContainerProps {
  databaseId: string | undefined;
  viewId: string | undefined;
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
  const updateTaskMutation = useUpdateTask(task.database_id);
  const deleteTaskMutation = useDeleteKanbanTask(task.database_id);

  const handleTaskUpdated = async (changes: Partial<Task>) => {
    if (!viewId) return;
    await updateTaskMutation.mutateAsync({
      id: task.id,
      viewId,
      changes,
    });
  };

  const handleTaskDeleted = async () => {
    if (!viewId) return;
    await deleteTaskMutation.mutateAsync({ taskToDelete: task, viewId });
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
          taskId={task.id}
          databaseId={databaseId}
          viewId={viewId}
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
