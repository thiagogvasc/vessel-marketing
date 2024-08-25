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
    const properties: PropertyWithDefinition[] = [];

    Object.entries(taskProperties).forEach(([key, value]) => {
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
    setNewPropertiesWithDefinitions(properties);
  }, [propertyDefinitions, taskProperties]);

  return { propertiesWithDefinitions };
};
