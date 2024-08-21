'use client'

import React, { useState } from 'react';
import { useAddKanbanColumn, useAddTask, useDeleteKanbanColumn, useGetDatabaseWithTasks, useUpdateKanbanViewManualSort } from '../hooks/useTasks';
import { DatabaseView } from '../types';
import { TaskWithId } from '../components/KanbanView/Task';
import { KanbanView } from '../components/KanbanView';
import { useKanbanColumns } from '../hooks/useKanbanColumns';
import { TaskDialogContainer } from './TaskDialogContainer';

interface KanbanViewProps {
  databaseId: string;
  databaseView: DatabaseView;
  readOnly: boolean;
}

export const AgentKanbanViewContainer: React.FC<KanbanViewProps> = ({ databaseId, databaseView, readOnly }) => {
  const { data: databaseWithTasks, isLoading: isTasksLoading } = useGetDatabaseWithTasks(databaseId);
  const updateKanbanViewManualSort = useUpdateKanbanViewManualSort(databaseId, databaseView.id as string);
  const addKanbanColumnMutation = useAddKanbanColumn(databaseId, databaseView.name);
  const addTaskMutation = useAddTask(databaseId, databaseView.name);
  const deleteColumnMutation = useDeleteKanbanColumn(databaseId, databaseView.name);

  const { columns, setColumns } = useKanbanColumns(databaseWithTasks, databaseView);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskWithId | null>(null);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    const sourceColumnTitle = result.source.droppableId;
    const destinationColumnTitle = result.destination.droppableId;

    const sourceColumn = columns.find(col => col.title === sourceColumnTitle);
    const destinationColumn = columns.find(col => col.title === destinationColumnTitle);

    if (sourceColumn && destinationColumn) {
      const [movedTask] = sourceColumn.tasks.splice(sourceIndex, 1);
      destinationColumn.tasks.splice(destinationIndex, 0, movedTask);

      setColumns(columns.map(col => {
        if (col.title === sourceColumnTitle) return sourceColumn;
        if (col.title === destinationColumnTitle) return destinationColumn;
        return col;
      }));

      const groupByField = databaseView.config?.group_by;
      if (groupByField) {
        updateKanbanViewManualSort.mutateAsync({
          columns, taskId: movedTask.id!, updatedTask: {
            ...movedTask,
            properties: {
              [groupByField]: destinationColumn.title
            }
          }
        });
      }
    }
  };

  const handleColumnAdded = (newColumnTitle: string) => {
    if (newColumnTitle.trim() === '') return;
    addKanbanColumnMutation.mutateAsync({
      databaseId, 
      viewName: databaseView.name,
      newOption: newColumnTitle
    });
  };

  const handleTaskClicked = (taskClicked: TaskWithId) => {
    setSelectedTask(taskClicked);
    setIsTaskDialogOpen(true);
  }

  const handleTaskAdded = async (columnTitle: string, newTaskTitle: string) => {
    const defaultPropMap = new Map();
    databaseWithTasks?.propertyDefinitions.forEach(propDefinition => {
      if (propDefinition.name === 'status') {
        defaultPropMap.set('status', columnTitle);
      }
    })
    
    await addTaskMutation.mutateAsync({
      database_id: databaseId,
      title: newTaskTitle,
      description: '',
      comments: [],
      properties: Object.fromEntries(defaultPropMap)
    })
  }

  const handleColumnDeleted = async (columnTitle: string) => {
    await deleteColumnMutation.mutateAsync({ databaseId, viewName: databaseView.name, optionToDelete: columnTitle })
  }

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
          viewName={databaseView.name} 
          task={selectedTask} 
          open={isTaskDialogOpen} 
          dialogClosed={handleTaskDialogClose}
        />
      )}
    </>
  );
};