import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Task from './Task';
import { AggregateColumn, Column as ColumnType, Task as TaskType } from '../types';
import { Box } from '@mui/material';


interface ColumnProps {
  column: AggregateColumn;
}

const Column: React.FC<ColumnProps> = ({ column }) => {
  return (
    <Box sx={{ width: '30%', padding: '16px', background: '#f0f0f0', borderRadius: '8px', margin: '0 8px' }}>
      <h2>{column.title}</h2>
      <Droppable droppableId={column.title}>
        {(provided, snapshot) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {column?.tasks?.map((task, index) => (
              <Task key={task.id} task={task} index={index} />
              ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </Box>
  );
};

export default Column;
