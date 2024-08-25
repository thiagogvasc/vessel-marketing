import React, { useEffect, useState } from "react";
import { TaskProperties } from "../components/TaskDialog/TaskProperties";
import { useGetDatabasePropertyDefinitions } from "../hooks/react-query/database_property_definition";
import { DatabasePropertyDefinition } from "../types";
import { usePropertiesWithDefinitions } from "../hooks/usePropertiesWithDefinitions";

export interface PropertyWithDefinition {
  definition: DatabasePropertyDefinition;
  value: any;
}

interface TaskPropertiesContainerProps {
  database_id: string;
  taskProperties: { [key: string]: any };
}

export const TaskPropertiesContainer: React.FC<
  TaskPropertiesContainerProps
> = ({ database_id, taskProperties }) => {
  const { data: propertyDefinitions } =
    useGetDatabasePropertyDefinitions(database_id);
  const { propertiesWithDefinitions } = usePropertiesWithDefinitions(
    taskProperties,
    propertyDefinitions,
  );

  const handlePropertyChange = (propertyName: string, newValue: any) => {
    // mutateAsync changes:{properties: {propertyName: newValue}}
  };

  const handleAddProperty = () => {};

  const handleDeleteProperty = () => {};

  const handleEditProperty = () => {};

  console.warn({ propertiesWithDefinitions });
  return (
    <TaskProperties propertiesWithDefinitions={propertiesWithDefinitions} />
  );
};
