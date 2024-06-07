import React, { useEffect, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useBoard, useUpdateTaskOrder } from '../hooks/useTasks';
import Column from './Column';
import AddTaskForm from './AddTaskForm';
import { Column as ColumnType, AggregateColumn } from '../types';

interface KanbanBoardProps {
  boardId: string;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ boardId }) => {
  const { data, isLoading } = useBoard(boardId);
  const [columns, setColumns] = useState<AggregateColumn[]>([]);
  const updateTaskOrderMutation = useUpdateTaskOrder(boardId);

  console.warn(columns)

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

  if (isLoading) return <>Lloding</>

  return (
    <div>
      <AddTaskForm boardId={boardId} />
      <DragDropContext onDragEnd={handleDragEnd}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {columns.map(column => (
            <Column key={column.title} column={column} />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;
