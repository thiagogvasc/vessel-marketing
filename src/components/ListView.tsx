'use client'

import React from 'react';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Typography, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Task } from '../types';

interface ListViewProps {
  tasks: Task[];
}

const ListView: React.FC<ListViewProps> = ({ tasks }) => {
  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Task List
      </Typography>
      <List>
        {tasks.map((task) => (
          <div key={task.id}>
            <ListItem>
              <ListItemText
                primary={task.title}
                secondary={task.description || `Status: ${task.status}`}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
          </div>
        ))}
      </List>
    </div>
  );
};

export default ListView;
