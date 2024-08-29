import { useEffect, useState } from "react";
import {
  AggregateColumn,
  Database,
  DatabasePropertyDefinition,
  DatabaseView,
  Task,
} from "../types";

export const useKanbanColumns = (
  orderedTasks: Task[] | null | undefined,
  propertyDefinitions: DatabasePropertyDefinition[] | null | undefined,
  databaseView: DatabaseView | null | undefined
) => {
  const [columns, setColumns] = useState<AggregateColumn[]>([]);
  useEffect(() => {
    if (orderedTasks && propertyDefinitions) {
      const taskMap = new Map<string, Task[]>();

      orderedTasks.forEach(task => {
        const value = task.properties[databaseView?.config?.group_by!]
        if (!value) {
          if (!taskMap.get('No value')) {
            taskMap.set('No value', []);
          } 
          taskMap.get('No value')?.push(task);
        } else {
          if (!taskMap.get(value)) {
            taskMap.set(value, []);
          } 
          taskMap.get(value)?.push(task);
        }
      })

      const newColumns: AggregateColumn[] = [];
      
      databaseView?.config?.groups?.forEach(group => {
        const tasks = taskMap.get(group);
        console.warn({group, tasks})
        newColumns.push({ title: group, tasks: tasks ?? [] })
      })
      setColumns(newColumns)
    }
  }, [orderedTasks, propertyDefinitions, databaseView]);
  return { columns, setColumns };
};
