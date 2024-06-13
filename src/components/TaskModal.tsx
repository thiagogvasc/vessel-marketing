import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { Task as TaskType } from '../types';
// import { DatePicker } from '@mui/lab';
// import AdapterDateFns from '@mui/lab/AdapterDateFns';
// import LocalizationProvider from '@mui/lab/LocalizationProvider';

export interface TaskWithId extends TaskType {
  id: string;
}

interface TaskModalProps {
  task: TaskWithId | null;
  open: boolean;
  onClose: () => void;
  onSave: (updatedTask: TaskWithId) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ task, open, onClose, onSave }) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState(task?.priority || 'medium');
  const [dueDate, setDueDate] = useState<Date | null>(task?.due_date ? new Date(task.due_date) : null);
  const [assignedTo, setAssignedTo] = useState(task?.assigned_to || '');
//   const [tags, setTags] = useState<string[]>(task?.tags || []);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority);
      setDueDate(task.due_date ? new Date(task.due_date) : null);
    //   setAssignedTo(task.assigned_to);
    //   setTags(task.tags);
    }
  }, [task]);

  const handleSave = () => {
    // if (task) {
    //   onSave({ ...task, title, description, priority, due_date: dueDate?.toISOString() || '', assigned_to: assignedTo, tags });
    // }
    // onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Edit Task</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={4}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel id="priority-label">Priority</InputLabel>
            <Select
              labelId="priority-label"
              value={priority}
            //   onChange={(e) => setPriority(e.target.value)}
              fullWidth
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
          {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Due Date"
              value={dueDate}
              onChange={(newValue) => setDueDate(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider> */}
          <TextField
            label="Assigned To"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            fullWidth
          />
          <TextField
            label="Tags"
            // value={tags.join(', ')}
            // onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()))}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskModal;
