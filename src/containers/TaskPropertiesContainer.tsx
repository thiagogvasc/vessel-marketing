import React from "react";
import { TaskProperties } from "../components/TaskDialog/TaskProperties";
import {
  useAddPropertyDefinition,
  useDeletePropertyDefinition,
  useGetDatabasePropertyDefinitions,
  useUpdatePropertyDefinition,
} from "../hooks/react-query/database_property_definition";
import { DatabasePropertyDefinition, PropertyType } from "../types";
import { usePropertiesWithDefinitions } from "../hooks/usePropertiesWithDefinitions";
import { useUpdateTask } from "../hooks/react-query/database_view";
import { v4 as uuidv4 } from "uuid";

export interface PropertyWithDefinition {
  definition: DatabasePropertyDefinition;
  value: any;
}

interface TaskPropertiesContainerProps {
  databaseId: string | undefined;
  viewId: string | undefined;
  taskId: string | undefined;
  taskProperties: { [key: string]: any };
}

export const TaskPropertiesContainer: React.FC<
  TaskPropertiesContainerProps
> = ({ databaseId, viewId, taskId, taskProperties }) => {
  const { data: propertyDefinitions } =
    useGetDatabasePropertyDefinitions(databaseId);
  const { propertiesWithDefinitions } = usePropertiesWithDefinitions(
    taskProperties,
    propertyDefinitions,
  );

  const addPropertyDefinitionMutation = useAddPropertyDefinition(databaseId);
  const deletePropertyDefinitionMutation =
    useDeletePropertyDefinition(databaseId);
  const updatePropertyDefinitionMutation =
    useUpdatePropertyDefinition(databaseId);
  const updateTaskMutation = useUpdateTask(databaseId);

  const handlePropertyChange = (propertyId: string, newValue: any) => {
    if (!taskId || !viewId) return;
    updateTaskMutation.mutateAsync({
      id: taskId,
      viewId,
      changes: { properties: { ...taskProperties, [propertyId]: newValue } },
    });
  };

  const handleAddProperty = (name: string, type: string, value: unknown) => {
    if (!databaseId || !viewId || !taskId) return;
    const propertyDefinition: DatabasePropertyDefinition = {
      id: uuidv4(),
      database_id: databaseId,
      name,
      type: type as PropertyType,
      data: {},
    };
    addPropertyDefinitionMutation.mutateAsync(propertyDefinition);
    updateTaskMutation.mutateAsync({
      id: taskId,
      viewId,
      changes: {
        properties: { ...taskProperties, [propertyDefinition.id]: value },
      },
    });
  };

  const handleDeleteProperty = (id: string) => {
    deletePropertyDefinitionMutation.mutateAsync(id);
  };

  const handleEditProperty = () => {};

  return (
    <TaskProperties
      propertiesWithDefinitions={propertiesWithDefinitions}
      onPropertyChange={handlePropertyChange}
      onAddProperty={handleAddProperty}
      onEditProperty={handleEditProperty}
      onPropertyDelete={handleDeleteProperty}
    />
  );
};
