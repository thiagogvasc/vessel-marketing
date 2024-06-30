import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Card, CardContent, Paper, Typography } from '@mui/material';
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
          sx={{ mb: 2, cursor: 'pointer', borderRadius: 2, boxShadow: 'rgba(0, 0, 0, 0.04) 0px 5px 22px, rgba(0, 0, 0, 0.03) 0px 0px 0px 0.5px' }}
          onClick={() => onClick(task)}
          elevation={0}
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
