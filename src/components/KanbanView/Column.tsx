'use client'

import React, { useEffect, useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Task, TaskWithId } from './Task';
import { AggregateColumn } from '../../types';
import { Box, Typography, IconButton, TextField, Button, Menu, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface ColumnProps {
  column: AggregateColumn;
  readOnly: boolean;
  taskAdded?: (columnTitle: string, newTaskTitle: string) => void;
  taskClicked?: (taskClicked: TaskWithId) => void;
  columnDeleted?: (columnTitle: string) => void;
}

export const Column: React.FC<ColumnProps> = ({ column, readOnly, taskAdded, taskClicked, columnDeleted }) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskWithId | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  useEffect(() => {
    if (selectedTask) {
      const prevTask = column.tasks.find(task => task.id === selectedTask.id) as TaskWithId ?? null
      setSelectedTask(prevTask)
    }
  }, [column])

  const handleAddTask = () => {
    if (newTaskTitle.trim() === '') {
      setIsAddingTask(false);
      return;
    }

    taskAdded?.(column.title, newTaskTitle);
    setNewTaskTitle('');
    setIsAddingTask(false);
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

  const handleTaskClick = (task: TaskWithId) => {
    taskClicked?.(task);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteColumn = () => {
    columnDeleted?.(column.title);
    handleMenuClose();
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" gutterBottom>
          {column.title}
        </Typography>
        <IconButton onClick={handleMenuOpen}>
          <MoreVertIcon />
        </IconButton>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleDeleteColumn}>Delete</MenuItem>
      </Menu>
      <Droppable droppableId={column.title}>
        {(provided, snapshot) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{ display:'flex', flexDirection:'column', gap: 1, minHeight: '64px', background: snapshot.isDraggingOver ? 'lightblue' : 'inherit', p: 1, borderRadius: '8px' }}
          >
            {column.tasks.map((task, index) => (
              task?.id && <Task readOnly={readOnly} key={task.id} task={task as TaskWithId} index={index} onClick={handleTaskClick} />
            ))}
            {isAddingTask && (
              <Box sx={{ p: 2, background: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)' }}>
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Button variant="contained" color="primary" onClick={handleAddTask}>
                    Add
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={() => setIsAddingTask(false)}>
                    Cancel
                  </Button>
                </Box>
              </Box>
            )}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
      {!isAddingTask && (
        <IconButton color="primary" onClick={() => setIsAddingTask(true)}>
          <AddIcon />
        </IconButton>
      )}
    </Box>
  );
};
