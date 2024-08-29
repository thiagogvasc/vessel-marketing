"use client";

import React, { useEffect, useState } from "react";
import { DatabaseView, Task } from "../types";
import { TaskWithId } from "../components/KanbanView/Task";
import { KanbanView } from "../components/KanbanView";
import { useKanbanColumns } from "../hooks/useKanbanColumns";
import { TaskDialogContainer } from "./TaskDialogContainer";
import { useGetDatabaseTasks } from "../hooks/react-query/database";
import {
  useAddKanbanColumn,
  useAddKanbanTask,
  useDeleteKanbanColumn,
  useGetViewTaskOrdersByViewId,
  useUpdateKanbanViewManualSort,
} from "../hooks/react-query/database_view";
import { v4 as uuidv4 } from "uuid";
import { useGetDatabasePropertyDefinitions } from "../hooks/react-query/database_property_definition";
import { useOrderedTasks } from "../hooks/useOrderedTasks";

interface KanbanViewProps {
  databaseId: string;
  databaseView: DatabaseView;
  readOnly: boolean;
}

export const AgentKanbanViewContainer: React.FC<KanbanViewProps> = ({
  databaseId,
  databaseView,
  readOnly,
}) => {
  const { data: databaseTasks, isLoading: isTasksLoading } =
    useGetDatabaseTasks(databaseId as string);

    const { data: propertyDefinitions } = useGetDatabasePropertyDefinitions(databaseId);

  const { data: viewTaskOrders } = useGetViewTaskOrdersByViewId(databaseView.id);
  const updateKanbanViewManualSort = useUpdateKanbanViewManualSort(
    databaseId,
    databaseView.id as string,
  );
  const addKanbanColumnMutation = useAddKanbanColumn(
    databaseId,
    databaseView.id,
  );
  const addTaskMutation = useAddKanbanTask(databaseId, databaseView.id);
  const deleteColumnMutation = useDeleteKanbanColumn(
    databaseId,
    databaseView.id,
  );

  const { orderedTasks } = useOrderedTasks(databaseTasks, viewTaskOrders);
  const { columns, setColumns } = useKanbanColumns(orderedTasks, propertyDefinitions, databaseView);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  useEffect(() => {
    if (selectedTask && databaseTasks) {
      const newSelectedTask = databaseTasks.find(
        (task) => task.id === selectedTask.id,
      );
      newSelectedTask && setSelectedTask(newSelectedTask);
    }
  }, [databaseTasks]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    const sourceColumnTitle = result.source.droppableId;
    const destinationColumnTitle = result.destination.droppableId;

    const sourceColumn = columns.find((col) => col.title === sourceColumnTitle);
    const destinationColumn = columns.find(
      (col) => col.title === destinationColumnTitle,
    );

    if (sourceColumn && destinationColumn) {
      const [movedTask] = sourceColumn.tasks.splice(sourceIndex, 1);
      destinationColumn.tasks.splice(destinationIndex, 0, movedTask);

      setColumns(
        columns.map((col) => {
          if (col.title === sourceColumnTitle) return sourceColumn;
          if (col.title === destinationColumnTitle) return destinationColumn;
          return col;
        }),
      );

      console.warn("sending columns to db", columns);
      const groupByField = databaseView.config?.group_by;
      if (groupByField) {
        updateKanbanViewManualSort.mutateAsync({
          columns,
          taskId: movedTask.id!,
          taskChanges: {
            properties: {
              ...movedTask.properties,
              [groupByField]: destinationColumn.title,
            },
          },
        });
      }
    }
  };

  const handleColumnAdded = (newColumnTitle: string) => {
    if (newColumnTitle.trim() === "") return;
    addKanbanColumnMutation.mutateAsync({
      databaseId,
      viewName: databaseView.name,
      newOption: newColumnTitle,
    });
  };

  const handleTaskClicked = (taskClicked: TaskWithId) => {
    setSelectedTask(taskClicked);
    setIsTaskDialogOpen(true);
  };

  const handleTaskAdded = async (columnTitle: string, newTaskTitle: string) => {
    if (!databaseView.config?.group_by) return;
  
    const newTask: Task = {
      id: uuidv4(),
      database_id: databaseId,
      title: newTaskTitle,
      description: "",
      properties: { [databaseView.config.group_by]: columnTitle },
    };
  
    let afterTaskId: string | null = null;
  
    columns.forEach((col, index) => {
      if (col.title === columnTitle) {
        if (col.tasks.length > 0) {
          // Get the ID of the last task in the current column
          afterTaskId = col.tasks[col.tasks.length - 1]?.id ?? null;
        } else if (index > 0) {
          // If the column is empty, get the last task from the previous column
          const previousColumn = columns[index - 1];
          if (previousColumn.tasks.length > 0) {
            afterTaskId = previousColumn.tasks[previousColumn.tasks.length - 1].id;
          }
        }
      }
    });
  
    addTaskMutation.mutate({ task: newTask, afterTaskId });
  };
  

  const handleColumnDeleted = async (columnTitle: string) => {
    await deleteColumnMutation.mutateAsync({
      databaseId,
      viewName: databaseView.name,
      optionToDelete: columnTitle,
    });
  };

  const handleTaskDialogClose = () => {
    setIsTaskDialogOpen(false);
    setSelectedTask(null);
  };

  if (isTasksLoading) return <div>Loading...</div>;
  return (
    <>
      <KanbanView
        readOnly={readOnly}
        columns={columns}
        taskDragged={handleDragEnd}
        columnAdded={handleColumnAdded}
        columnDeleted={handleColumnDeleted}
        taskAdded={handleTaskAdded}
        taskClicked={handleTaskClicked}
      />
      {selectedTask && (
        <TaskDialogContainer
          databaseId={databaseId}
          viewId={databaseView.id}
          task={selectedTask}
          open={isTaskDialogOpen}
          dialogClosed={handleTaskDialogClose}
        />
      )}
    </>
  );
};
