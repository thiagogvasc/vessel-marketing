import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  IconButton,
  Menu,
  MenuItem as MenuOption,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Task, Task as TaskType } from "../../types";

export interface TaskWithId extends TaskType {
  id: string;
}

interface TaskDialogProps {
  task: TaskWithId;
  TaskCommentsComponent: React.ReactNode;
  TaskPropertiesComponent: React.ReactNode;
  open: boolean;
  onClose: () => void;
  onUpdate?: (changes: Partial<Task>) => void;
  onDelete: () => void;
  readOnly: boolean;
}

const TaskDialog: React.FC<TaskDialogProps> = ({
  task,
  TaskCommentsComponent,
  TaskPropertiesComponent,
  open,
  onClose,
  onUpdate,
  onDelete,
  readOnly,
}) => {
  const [newTitle, setNewTitle] = useState(task.title);
  const [newDescription, setNewDescription] = useState(task.description);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleTitleBlur = () => {
    if (newTitle !== task.title) {
      onUpdate?.({ title: newTitle });
    }
  };

  const handleDescriptionBlur = () => {
    if (newDescription !== task.description) {
      onUpdate?.({ description: newDescription });
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}
          >
            <TextField
              label="Title"
              size="small"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onBlur={handleTitleBlur}
              fullWidth
              variant="outlined"
              disabled={readOnly}
            />
            <Box sx={{ display: "flex", gap: 4 }}>
              <TextField
                label="Description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                onBlur={handleDescriptionBlur}
                multiline
                rows={10}
                fullWidth
                disabled={readOnly}
                sx={{ flex: 7 }}
              />
              <Box
                sx={{
                  flex: 3,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {TaskPropertiesComponent}
              </Box>
            </Box>
            <Box>{TaskCommentsComponent}</Box>
          </Box>
          <IconButton onClick={handleMenuOpen} disabled={readOnly}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuOption onClick={handleDelete}>Delete</MenuOption>
          </Menu>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
