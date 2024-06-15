import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Card, CardContent, Typography } from '@mui/material';
import { Task as TaskType } from '../types';

export interface TaskWithId extends TaskType {
  id: string;
}

interface TaskProps {
  task: TaskWithId;
  index: number;
  onClick: (task: TaskWithId) => void;
}

const Task: React.FC<TaskProps> = ({ task, index, onClick }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          sx={{ mb: 2, cursor: 'pointer' }}
          onClick={() => onClick(task)}
        >
          <CardContent>
            <Typography variant="body1">{task.title}</Typography>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
};

export default Task;
