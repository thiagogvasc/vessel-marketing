'use client'

import React, { useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Task, { TaskWithId } from './Task';
import { AggregateColumn, Task as TaskType } from '../types';
import { Box, Paper, Typography, IconButton, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAddTask } from '../hooks/useTasks';

interface ColumnProps {
  column: AggregateColumn;
  boardId: string;
}

const Column: React.FC<ColumnProps> = ({ column, boardId }) => {
  const addTaskMutation = useAddTask(boardId);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);

  const handleAddTask = () => {
    if (newTaskTitle.trim() === '') {
      setIsAddingTask(false);
      return;
    }
    addTaskMutation.mutateAsync({
      board_id: boardId,
      title: newTaskTitle,
      description: '',
      priority: 'medium',
      status: column.title as 'To Do' | 'In Progress' | 'Done',
      columnTitle: column.title,
      assigned_to: '', // Add assigned_to if necessary
    }).then(() => {
      setNewTaskTitle('');
      setIsAddingTask(false);
    });
  };

  const handleTaskTitleBlur = () => {
    handleAddTask();
  };

  const handleTaskTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask();
    } else if (e.key === 'Escape') {
      setIsAddingTask(false);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 2, background: '#f0f0f0', borderRadius: '8px', position: 'relative' }}>
      <Typography variant="h6" gutterBottom>
        {column.title}
      </Typography>
      <Droppable droppableId={column.title}>
        {(provided, snapshot) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{ minHeight: '100px', background: snapshot.isDraggingOver ? 'lightblue' : '#f0f0f0', p: 1, borderRadius: '8px' }}
          >
            {column.tasks.map((task, index) => (
              task?.id && <Task key={task.id} task={task as TaskWithId} index={index} />
            ))}
            {isAddingTask && (
              <Box sx={{ p: 2, mb: 2, background: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)' }}>
                <TextField
                  placeholder="Task title"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onBlur={handleTaskTitleBlur}
                  onKeyDown={handleTaskTitleKeyDown}
                  variant="outlined"
                  size="small"
                  fullWidth
                  autoFocus
                />
              </Box>
            )}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
      <IconButton color="primary" onClick={() => setIsAddingTask(true)} sx={{ mt: 2 }}>
        <AddIcon />
      </IconButton>
    </Paper>
  );
};

export default Column;
