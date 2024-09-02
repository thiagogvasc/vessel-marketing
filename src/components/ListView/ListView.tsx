"use client";

import React from "react";
import { Task } from "../../types";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import DragHandleIcon from "@mui/icons-material/DragHandle";

interface ListViewProps {
  readOnly: boolean;
  tasks: Task[];
}

export const ListView: React.FC<ListViewProps> = ({ tasks, readOnly }) => {
  return (
    <Box sx={{ width: "100%", padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Task List
      </Typography>
      <List>
        {tasks.map((task) => (
          <ListItem
            key={task.id}
            sx={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              marginBottom: 1,
              display: "flex",
              alignItems: "center",
              backgroundColor: "#f9f9f9",
              ":hover": {
                backgroundColor: "#f0f0f0",
                cursor: readOnly ? "default" : "pointer",
              },
            }}
          >
            {!readOnly && (
              <DragHandleIcon sx={{ marginRight: 2, color: "gray" }} />
            )}
            <ListItemText
              primary={task.title}
              secondary={task.description}
              sx={{ flexGrow: 1 }}
            />
            {!readOnly && (
              <IconButton edge="end" aria-label="delete">
                <DeleteIcon />
              </IconButton>
            )}
          </ListItem>
        ))}
        {!readOnly && (
          <ListItem
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 2,
              backgroundColor: "#e0e0e0",
              borderRadius: "8px",
              ":hover": {
                backgroundColor: "#d0d0d0",
                cursor: "pointer",
              },
            }}
          >
            <IconButton aria-label="add">
              <AddIcon />
            </IconButton>
            <Typography>Add New Task</Typography>
          </ListItem>
        )}
      </List>
    </Box>
  );
};
