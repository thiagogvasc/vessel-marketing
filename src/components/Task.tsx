import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Task as TaskType } from '../types';

interface TaskProps {
  task: TaskType;
  index: number;
}

const Task: React.FC<TaskProps> = ({ task, index }) => {
  if (!task.id) return;
  return (
    <Draggable draggableId={task?.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{ padding: '16px', margin: '8px 0', background: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)', ...provided.draggableProps.style }}
        >
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <p>{task.priority} priority</p>
        </div>
      )}
    </Draggable>
  );
};

export default Task;
