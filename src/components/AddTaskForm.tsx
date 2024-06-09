'use client'

import React, { useState } from 'react';
import { useAddTask } from '../hooks/useTasks';
import { Task } from '../types';
import { Box, Button, TextField, Grid, MenuItem } from '@mui/material';

interface TaskFormProps {
  boardId: string;
}

const AddTaskForm: React.FC<TaskFormProps> = ({ boardId }) => {
  const addTaskMutation = useAddTask(boardId);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [status, setStatus] = useState<Task['status']>('To Do');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTaskMutation.mutateAsync({
      board_id: boardId,
      title,
      description,
      priority,
      status,
      columnTitle: status,
      assigned_to: '', // Add assigned_to if necessary
    }).then(res => {
      console.warn('mutated')
    });
    setTitle('');
    setDescription('');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            name="title"
            required
            fullWidth
            id="title"
            label="Title"
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="description"
            required
            fullWidth
            id="description"
            label="Description"
            multiline
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="priority"
            required
            fullWidth
            id="priority"
            label="Priority"
            select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Task['priority'])}
          >
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="status"
            required
            fullWidth
            id="status"
            label="Status"
            select
            value={status}
            onChange={(e) => setStatus(e.target.value as Task['status'])}
          >
            <MenuItem value="To Do">To Do</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Done">Done</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Add Task
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddTaskForm;
