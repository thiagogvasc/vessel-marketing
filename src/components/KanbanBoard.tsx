import React, { useEffect, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useBoard, useUpdateTaskOrder } from '../hooks/useTasks';
import Column from './Column';
import { AggregateColumn, Column as ColumnType } from '../types';
import { Box, CircularProgress, Grid, Fade, Grow } from '@mui/material';

interface KanbanBoardProps {
  boardId: string;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ boardId }) => {
  const { data, isLoading } = useBoard(boardId);
  const [columns, setColumns] = useState<AggregateColumn[]>([]);
  const updateTaskOrderMutation = useUpdateTaskOrder(boardId);

  useEffect(() => {
    if (data) {
      setColumns(data.aggregateColumns);
    }
  }, [data]);

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

      updateTaskOrderMutation.mutate(
        columns.map(column => ({
          title: column.title,
          taskIds: column.tasks.map(task => task?.id),
        } as ColumnType))
      );
    }
  };

  if (isLoading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <CircularProgress />
    </Box>
  );

  return (
    <div>
      <Fade in timeout={500}>
        <Box>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {columns.map(column => (
                <Grow in timeout={1000} key={column.title}>
                  <Grid item xs={12} md={4}>
                    <Column column={column} boardId={boardId} />
                  </Grid>
                </Grow>
              ))}
            </Grid>
          </DragDropContext>
        </Box>
      </Fade>
    </div>
  );
};

export default KanbanBoard;
