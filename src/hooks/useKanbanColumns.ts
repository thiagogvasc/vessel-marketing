import { useEffect, useState } from "react";
import { AggregateColumn, Database, DatabasePropertyDefinition, DatabaseView, Task } from "../types";

export const useKanbanColumns = (
  databaseTasks: Task[] | null | undefined,
  databaseView: DatabaseView | null,
  propertyDefinitions: DatabasePropertyDefinition[] | null | undefined,
) => {
  const [columns, setColumns] = useState<AggregateColumn[]>([]);
  console.warn({ databaseView, databaseTasks });
  useEffect(() => {
    if (databaseTasks && databaseView) {
      const initialColumns: AggregateColumn[] = [];
      databaseView.config?.groups?.forEach((sortGroup) => {
        const taskIds = sortGroup.task_order;
        const columnTitle = sortGroup.group_by_value;
        const tasks = taskIds.map(
          (taskId) => databaseTasks.find((t) => t.id === taskId) as Task,
        );
        initialColumns.push({
          title: columnTitle,
          tasks,
        });
      });
      setColumns(initialColumns);
    }
  }, [databaseTasks, databaseView]);

  return { columns, setColumns };
};
