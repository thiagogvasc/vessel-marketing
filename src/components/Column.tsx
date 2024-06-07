import React, { useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Task from './Task';
import { AggregateColumn, Task as TaskType } from '../types';
import { Box, Paper, Typography, Fab, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAddTask } from '../hooks/useTasks';

interface ColumnProps {
  column: AggregateColumn;
  boardId: string;
}

const Column: React.FC<ColumnProps> = ({ column, boardId }) => {
  const addTaskMutation = useAddTask(boardId);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskType['priority']>('medium');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTaskMutation.mutateAsync({
      board_id: boardId,
      title,
      description,
      priority,
      status: column.title as 'To Do' | 'In Progress' | 'Done',
      columnTitle: column.title,
      assigned_to: '', // Add assigned_to if necessary
    }).then(res => {
      console.warn('mutated')
    });
    setTitle('');
    setDescription('');
    setPriority('medium');
    handleClose();
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
              <Task key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
      <Fab size="small" color="primary" aria-label="add" sx={{ position: 'absolute', top: 8, right: 8 }} onClick={handleClickOpen}>
        <AddIcon />
      </Fab>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Task</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              name="title"
              required
              fullWidth
              id="title"
              label="Title"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              margin="dense"
            />
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
              margin="dense"
            />
            <TextField
              name="priority"
              required
              fullWidth
              id="priority"
              label="Priority"
              select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskType['priority'])}
              margin="dense"
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </TextField>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                Add
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </Paper>
  );
};

export default Column;
