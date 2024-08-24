import React, { useEffect, useState } from "react";
import {
  DatabasePropertyDefinition,
  Task,
  TaskComment,
  Task as TaskType,
} from "../types";
import {
  useDeleteTask,
  useGetDatabaseWithTasks,
  useUpdateTask,
} from "../hooks/useTasks";
import TaskDialog from "../components/TaskDialog/TaskDialog";

export interface TaskWithId extends TaskType {
  id: string;
}

export interface PropertyWithDefinition {
  definition: DatabasePropertyDefinition;
  value: any;
}

interface TaskDialogContainerProps {
  databaseId: string;
  viewName: string;
  task: TaskWithId;
  open: boolean;
  dialogClosed?: () => void;
}

export const TaskDialogContainer = ({
  task,
  open,
  databaseId,
  viewName,
  dialogClosed,
}: TaskDialogContainerProps) => {
  const { data: databaseWithTasks } = useGetDatabaseWithTasks(databaseId);
  const updateTaskMutation = useUpdateTask(task.database_id, viewName);
  const deleteTaskMutation = useDeleteTask(task.database_id, viewName);

  const comments: TaskComment[] = [
    {
      author: "thiago",
      text: "my commetn",
      created_at: "today",
      id: "1",
    },
    {
      author: "thiago2",
      text: "my commetn2",
      created_at: "today2",
      id: "2",
    },
    {
      author: "thiago3",
      text: "my commetn33333333",
      created_at: "today3333",
      id: "3",
    },
  ];
  task.comments = comments; //

  const [properties, setProperties] = useState<PropertyWithDefinition[]>([]);
  useEffect(() => {
    const propDefinitions = databaseWithTasks?.propertyDefinitions;
    const props = task?.properties;
    if (!props) return;

    const properties: PropertyWithDefinition[] = [];

    Object.entries(props).forEach(([key, value]) => {
      const [propertyName, propertyValue] = [key, value];
      const propertyDefinition = propDefinitions?.find(
        (propDef) => propDef.name === propertyName,
      );
      propertyDefinition &&
        properties.push({
          definition: propertyDefinition,
          value: propertyValue,
        });
    });
    setProperties(properties);
  }, [databaseWithTasks, task]);

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

  const handleCommentAdded = () => {};

  return (
    <TaskDialog
      readOnly={false}
      task={task}
      propertiesWithDefinitions={properties}
      open={open}
      onClose={handleTaskDialogClose}
      onSave={handleTaskUpdated}
      onDelete={handleTaskDeleted}
      onCommentAdded={handleCommentAdded}
    />
  );
};
