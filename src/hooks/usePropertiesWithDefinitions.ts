import { useEffect, useState } from "react";
import { DatabasePropertyDefinition } from "../types";
import { PropertyWithDefinition } from "../containers/TaskPropertiesContainer";

export const usePropertiesWithDefinitions = (
  taskProperties: { [key: string]: any },
  propertyDefinitions: DatabasePropertyDefinition[] | undefined | null,
) => {
  const [propertiesWithDefinitions, setNewPropertiesWithDefinitions] = useState<
    PropertyWithDefinition[]
  >([]);
  useEffect(() => {
    setNewPropertiesWithDefinitions(propertyDefinitions?.map(propertyDefinition => ({
			definition: propertyDefinition,
			value: taskProperties[propertyDefinition.name]
		})) ?? []);
  }, [propertyDefinitions, taskProperties]);

  return { propertiesWithDefinitions };
};
