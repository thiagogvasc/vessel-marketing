'use client'

import React, { useEffect, useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { useAddKanbanColumn, useGetDatabaseById, useGetDatabaseTasks } from '../hooks/useTasks';
import Column from './Column';
import { AggregateColumn, Column as ColumnType, DatabaseView, Task } from '../types';
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
  const addKanbanColumnMutation = useAddKanbanColumn(); 
console.warn(columns)

  useEffect(() => {
    if (databaseWithTasks) {
      const initialColumns: AggregateColumn[] = [];
      databaseWithTasks.propertyDefinitions.forEach(propertyDef => {
        if (propertyDef.name === 'status') {
          propertyDef.data?.options?.forEach(statusOption => {
            const tasks: Task[] = [];
            databaseWithTasks.tasks.forEach(task => {
              if (task.properties['status'] === statusOption) {
                tasks.push(task);
              }
            })
            initialColumns.push({
              title: statusOption,
              tasks
            })
          })
        }
      })
      setColumns(initialColumns);
    }
  }, [databaseWithTasks]);

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

      // updateTaskOrderMutation.mutate(
      //   columns.map(column => ({
      //     title: column.title,
      //     taskIds: column.tasks.map(task => task.id),
      //   } as ColumnType))
      // );
    }
  };

  const handleAddColumn = () => {
    if (newColumnTitle.trim() === '') return;
    // setColumns([...columns, { title: newColumnTitle, tasks: [] }]);
    addKanbanColumnMutation.mutateAsync({
      databaseId, 
      viewId: databaseView.id ?? '',
      newOption: newColumnTitle
    }).then(() => {
      setNewColumnTitle('');
      setIsAddingColumn(false);
    })
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
    <div>
      <Box>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {columns.map(column => (
              <React.Fragment key={column.title}>
                <Grid item xs={12} md={4}>
                  <Column column={column} databaseView={databaseView} databaseId={databaseId} />
                </Grid>
              </React.Fragment>
            ))}
            <Grid item xs={12} md={4}>
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
            </Grid>
          </Grid>
        </DragDropContext>
      </Box>
    </div>
  );
};

export default KanbanView;
