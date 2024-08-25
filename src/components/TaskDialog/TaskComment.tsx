import React, { useState, MouseEvent } from "react";
import {
  ListItem,
  ListItemText,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  ListItemSecondaryAction,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { TaskComment as TaskCommentType } from "@/src/types";

interface TaskCommentProps {
  comment: TaskCommentType;
  onUpdate?: (id: string, newText: string) => void;
  onDelete?: (id: string) => void;
}

export const TaskComment = ({
  comment,
  onUpdate,
  onDelete,
}: TaskCommentProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCommentText, setEditingCommentText] = useState(comment.text);

  const handleMenuClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setAnchorEl(null);
  };

  const handleSaveEdit = () => {
    if (editingCommentText.trim() !== "") {
      onUpdate?.(comment.id, editingCommentText);
    }
    setIsEditing(false);
  };

  const handleDiscardEdit = () => {
    setIsEditing(false);
    setEditingCommentText(comment.text);
  };

  const handleDelete = () => {
    onDelete?.(comment.id);
    setAnchorEl(null);
  };

  return (
    <ListItem>
      {isEditing ? (
        <TextField
          fullWidth
          value={editingCommentText}
          onChange={(e) => setEditingCommentText(e.target.value)}
        />
      ) : (
        <ListItemText primary={comment.text} />
      )}
      <ListItemSecondaryAction>
        {isEditing ? (
          <>
            <IconButton edge="end" onClick={handleSaveEdit}>
              <CheckIcon />
            </IconButton>
            <IconButton edge="end" onClick={handleDiscardEdit}>
              <CloseIcon />
            </IconButton>
          </>
        ) : (
          <IconButton edge="end" onClick={handleMenuClick}>
            <MoreVertIcon />
          </IconButton>
        )}
      </ListItemSecondaryAction>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </ListItem>
  );
};
