'use client'

import React, { useEffect, useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import Task, { TaskWithId } from './Task';
import { AggregateColumn, DatabaseView } from '../types';
import { Box, Paper, Typography, IconButton, TextField, Button, CircularProgress, Menu, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert'; // Import the MoreVertIcon
import TaskModal from './TaskModal';
import { useAddTask, useGetDatabaseById, useGetDatabaseTasks, useUpdateTask } from '../hooks/useTasks';

interface ColumnProps {
  column: AggregateColumn;
  databaseId: string;
  databaseView: DatabaseView;
}

const Column: React.FC<ColumnProps> = ({ column, databaseId, databaseView }) => {
  const addTaskMutation = useAddTask(databaseId, databaseView.name);
  const updateTaskMutation = useUpdateTask(databaseId, databaseView.name);
  const { data: database } = useGetDatabaseTasks(databaseId);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskWithId | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for context menu
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

    const defaultPropMap = new Map();
    database?.propertyDefinitions.forEach(propDefinition => {
      if (propDefinition.name === 'status') {
        defaultPropMap.set('status', column.title);
      }
    })
    
    addTaskMutation.mutateAsync({
      database_id: databaseId,
      title: newTaskTitle,
      description: '',
      properties: Object.fromEntries(defaultPropMap)
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

  const handleTaskClick = (task: TaskWithId) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleTaskSave = async (updatedTask: TaskWithId) => {
    await updateTaskMutation.mutateAsync({ id: updatedTask.id, updatedTask })
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteColumn = () => {
    // Add your delete logic here
    console.log('Delete column', column.title);
    handleMenuClose();
  };

  return (
    <Paper elevation={0} sx={{ p: 2, background: 'rgb(237 237 237)', borderRadius: '8px', position: 'relative', boxShadow: '0px 1px 2px 0px rgba(84,87,118,.12)' }}>
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
            sx={{ minHeight: '100px', background: snapshot.isDraggingOver ? 'lightblue' : 'rgb(237 237 237)', p: 1, borderRadius: '8px' }}
          >
            {column.tasks.map((task, index) => (
              task?.id && <Task key={task.id} task={task as TaskWithId} index={index} onClick={handleTaskClick} />
            ))}
            {isAddingTask && (
              <Box sx={{ p: 2, mb: 2, background: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)' }}>
                {addTaskMutation.isLoading ? 
                  <>
                    <CircularProgress />
                  </>
                : 
                  <>
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
                  </>
                }
              </Box>
            )}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
      {!isAddingTask && (
        <IconButton color="primary" onClick={() => setIsAddingTask(true)} sx={{ mt: 2 }}>
          <AddIcon />
        </IconButton>
      )}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          open={isModalOpen}
          onClose={handleModalClose}
          onSave={handleTaskSave}
        />
      )}
    </Paper>
  );
};

export default Column;
