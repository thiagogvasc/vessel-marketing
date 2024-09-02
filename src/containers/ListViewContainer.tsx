"use client";

import React, { useEffect, useState } from "react";
import { Task } from "../types";
import { TaskWithId } from "../components/KanbanView/Task";
import { KanbanView } from "../components/KanbanView";
import { useKanbanColumns } from "../hooks/useKanbanColumns";
import { TaskDialogContainer } from "./TaskDialogContainer";
import { useGetDatabaseTasks } from "../hooks/react-query/database";
import {
  useAddKanbanColumn,
  useAddKanbanTask,
  useDeleteKanbanColumn,
  useGetDatabaseViewById,
  useGetViewTaskOrdersByViewId,
  useUpdateKanbanViewManualSort,
} from "../hooks/react-query/database_view";
import { v4 as uuidv4 } from "uuid";
import { useGetDatabasePropertyDefinitions } from "../hooks/react-query/database_property_definition";
import { useOrderedTasks } from "../hooks/useOrderedTasks";
import { ListView } from "../components/ListView";

interface ListViewProps {
  databaseId: string | undefined;
  viewId: string | undefined;
  readOnly: boolean;
}

export const ListViewContainer: React.FC<ListViewProps> = ({
  databaseId,
  viewId,
}) => {
  const { data: databaseTasks, isLoading: isTasksLoading } =
    useGetDatabaseTasks(databaseId as string);
  const { data: viewTaskOrders } = useGetViewTaskOrdersByViewId(viewId);
  const { orderedTasks } = useOrderedTasks(databaseTasks, viewTaskOrders);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    if (selectedTask && databaseTasks) {
      const newSelectedTask = databaseTasks.find(
        (task) => task.id === selectedTask.id,
      );
      newSelectedTask && setSelectedTask(newSelectedTask);
    }
  }, [databaseTasks]);

  if (isTasksLoading) return <div>Loading...</div>;
  return (
    <>
      <ListView readOnly={false} tasks={orderedTasks} />
    </>
  );
};
