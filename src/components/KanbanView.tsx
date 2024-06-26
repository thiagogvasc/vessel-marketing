'use client'

import React, { useEffect, useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { useAddKanbanColumn, useGetDatabaseTasks, useUpdateKanbanViewManualSort } from '../hooks/useTasks';
import Column from './Column';
import { AggregateColumn, DatabaseView, Task } from '../types';
import { Box, Grid, IconButton, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface KanbanViewProps {
  databaseId: string;
  databaseView: DatabaseView;
}

const KanbanView: React.FC<KanbanViewProps> = ({ databaseId, databaseView }) => {
  const [columns, setColumns] = useState<AggregateColumn[]>([]);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const { data: databaseWithTasks, isLoading: isTasksLoading } = useGetDatabaseTasks(databaseId);
  console.warn('databasewithtaskss rerender', databaseWithTasks)
  const updateKanbanViewManualSort = useUpdateKanbanViewManualSort(databaseId, databaseView.id as string);
  const addKanbanColumnMutation = useAddKanbanColumn(databaseId, databaseView.name);

  useEffect(() => {
    console.warn('useeffect databasewithtasks')
    if (databaseWithTasks) {
      const initialColumns: AggregateColumn[] = [];
      databaseView.config?.groups?.forEach(sortGroup => {
        const taskIds = sortGroup.task_order;
        const columnTitle = sortGroup.group_by_value;
        const tasks = taskIds.map(taskId => databaseWithTasks.tasks.find(t => t.id === taskId) as Task);
        initialColumns.push({
          title: columnTitle,
          tasks
        });
      });
      setColumns(initialColumns);
      console.warn('initial columnsss',initialColumns)
    }
  }, [databaseWithTasks, databaseView]);

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
        }).then(() => {
          console.warn('updated order');
        });
      }
    }
  };

  const handleAddColumn = () => {
    if (newColumnTitle.trim() === '') return;
    addKanbanColumnMutation.mutateAsync({
      databaseId, 
      viewName: databaseView.name,
      newOption: newColumnTitle
    }).then(() => {
      setNewColumnTitle('');
      setIsAddingColumn(false);
    });
  };

  const handleColumnTitleBlur = () => {
    if (newColumnTitle.trim() !== '') {
      handleAddColumn();
    } else {
      setIsAddingColumn(false);
    }
  };

  const handleColumnTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddColumn();
    } else if (e.key === 'Escape') {
      setIsAddingColumn(false);
    }
  };

  if (isTasksLoading) return <div>Loading...</div>;

  return (
    <Box sx={{ overflow: 'auto', display: 'flex', flexDirection: 'column', width: '80vw', height: '60vh'}}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
          {columns.map(column => (
            <Box key={column.title} sx={{ minWidth: 300 }}>
              <Column column={column} databaseView={databaseView} databaseId={databaseId} />
            </Box>
          ))}
          <Box sx={{ minWidth: 300 }}>
            {isAddingColumn ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  placeholder="Column title"
                  value={newColumnTitle}
                  onChange={(e) => setNewColumnTitle(e.target.value)}
                  onBlur={handleColumnTitleBlur}
                  onKeyDown={handleColumnTitleKeyDown}
                  variant="outlined"
                  size="small"
                  sx={{ flex: 1 }}
                  autoFocus
                />
                <IconButton color="primary" onClick={handleAddColumn}>
                  <AddIcon />
                </IconButton>
              </Box>
            ) : (
              <IconButton color="primary" onClick={() => setIsAddingColumn(true)}>
                <AddIcon />
              </IconButton>
            )}
          </Box>
        </Box>
      </DragDropContext>
    </Box>
  );
};

export default KanbanView;
