import React from "react";
import { TaskProperties } from "../components/TaskDialog/TaskProperties";
import { useAddPropertyDefinition, useDeletePropertyDefinition, useGetDatabasePropertyDefinitions, useUpdatePropertyDefinition } from "../hooks/react-query/database_property_definition";
import { DatabasePropertyDefinition, PropertyType } from "../types";
import { usePropertiesWithDefinitions } from "../hooks/usePropertiesWithDefinitions";
import { useUpdateTask } from "../hooks/react-query/database_view";
import { v4 as uuidv4 } from 'uuid';

export interface PropertyWithDefinition {
  definition: DatabasePropertyDefinition;
  value: any;
}

interface TaskPropertiesContainerProps {
  database_id: string;
	view_id: string;
	task_id: string;
  taskProperties: { [key: string]: any };
}

export const TaskPropertiesContainer: React.FC<
  TaskPropertiesContainerProps
> = ({ database_id, view_id, task_id, taskProperties }) => {
  const { data: propertyDefinitions } =
    useGetDatabasePropertyDefinitions(database_id);
  const { propertiesWithDefinitions } = usePropertiesWithDefinitions(
    taskProperties,
    propertyDefinitions,
  );

	const addPropertyDefinitionMutation = useAddPropertyDefinition(database_id);
	const deletePropertyDefinitionMutation = useDeletePropertyDefinition(database_id);
	const updatePropertyDefinitionMutation = useUpdatePropertyDefinition(database_id);
	const updateTaskMutation = useUpdateTask(database_id, view_id);

  const handlePropertyChange = (propertyName: string, newValue: any) => {
		updateTaskMutation.mutateAsync({id: task_id, changes: { [propertyName]: newValue }});
  };

  const handleAddProperty = (name: string, type: string, value: unknown) => {
		const propertyDefinition: DatabasePropertyDefinition = {
			id: uuidv4(),
			database_id,
			name,
			type: type as PropertyType,
			data: {}
		}
		addPropertyDefinitionMutation.mutateAsync(propertyDefinition);
		updateTaskMutation.mutateAsync({ id: task_id, changes: { properties: { ...taskProperties, [name]: value }}});
	};

  const handleDeleteProperty = (id: string) => {
		deletePropertyDefinitionMutation.mutateAsync(id);
	};

  const handleEditProperty = () => {

	};

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
