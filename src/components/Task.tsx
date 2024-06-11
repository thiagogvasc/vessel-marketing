'use client'

import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Task as TaskType } from '../types';
import { Paper, Typography } from '@mui/material';

export interface TaskWithId extends TaskType {
  id: string;
}

interface TaskProps {
  task: TaskWithId;
  index: number;
}

const Task: React.FC<TaskProps> = ({ task, index }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <Paper
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          sx={{ p: 2, mb: 2, background: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)' }}
        >
          <Typography variant="h6">{task.title}</Typography>
          <Typography variant="body2">{task.description}</Typography>
          <Typography variant="body2">{task.priority} priority</Typography>
        </Paper>
      )}
    </Draggable>
  );
};

export default Task;