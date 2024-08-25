import React, { useEffect, useState } from "react";
import { DatabasePropertyDefinition, Task as TaskType } from "../types";
import TaskDialog from "../components/TaskDialog/TaskDialog";
import { useDeleteKanbanTask } from "../hooks/react-query/database_view";
import { useGetDatabasePropertyDefinitions } from "../hooks/react-query/database";
import { useUpdateTask } from "../hooks/react-query/database_view";
import { TaskCommentsContainer } from "./TaskCommentsContainer";

export interface TaskWithId extends TaskType {
  id: string;
}

export interface PropertyWithDefinition {
  definition: DatabasePropertyDefinition;
  value: any;
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
  const { data: propertyDefinitions } =
    useGetDatabasePropertyDefinitions(databaseId);
  const updateTaskMutation = useUpdateTask(task.database_id, viewId);
  const deleteTaskMutation = useDeleteKanbanTask(task.database_id, viewId);

  const [properties, setProperties] = useState<PropertyWithDefinition[]>([]);
  useEffect(() => {
    if (!task?.properties) return;
    const properties: PropertyWithDefinition[] = [];

    Object.entries(task?.properties).forEach(([key, value]) => {
      const [propertyName, propertyValue] = [key, value];
      const propertyDefinition = propertyDefinitions?.find(
        (propDef) => propDef.name === propertyName,
      );
      propertyDefinition &&
        properties.push({
          definition: propertyDefinition,
          value: propertyValue,
        });
    });
    setProperties(properties);
  }, [propertyDefinitions, task]);

  const handleTaskUpdated = async (
    title: string,
    description: string,
    propertiesWithDefinitions: PropertyWithDefinition[],
  ) => {
    const newProperties = propertiesWithDefinitions.reduce(
      (acc, prop) => {
        acc[prop.definition.name] = prop.value;
        return acc;
      },
      {} as { [key: string]: any },
    );
    await updateTaskMutation.mutateAsync({
      id: task.id,
      updatedTask: { title, description, properties: newProperties },
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
      propertiesWithDefinitions={properties}
      open={open}
      onClose={handleTaskDialogClose}
      onSave={handleTaskUpdated}
      onDelete={handleTaskDeleted}
    />
  );
};
