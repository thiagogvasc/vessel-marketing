import {
  Box,
  Popover,
  TextField,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Button,
  Typography,
} from "@mui/material";
import React, { ChangeEvent, useState } from "react";
import { DatabaseView, DatabasePropertyDefinition } from "@/src/types";

interface ViewSettingsPopoverProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onRenameView?: (name: string) => void;
  onViewTypeChange?: (type: string) => void;
  onGroupByChange?: (groupBy: string) => void;
  onDeleteView?: () => void;
  view: DatabaseView | undefined;
  propertyDefinitions: DatabasePropertyDefinition[] | undefined;
}

export const ViewSettingsPopover: React.FC<ViewSettingsPopoverProps> = ({
  anchorEl,
  onClose,
  onRenameView,
  onViewTypeChange,
  onGroupByChange,
  onDeleteView,
  view,
  propertyDefinitions,
}) => {
  const open = Boolean(anchorEl);
  const [newName, setNewName] = useState(view?.name ?? "");

  const handleNewNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value);
  };

  const handleNewNameBlur = () => {
    if (newName.trim() !== "" && newName !== view?.name) {
      onRenameView?.(newName);
    }
  };

  return (
    <Popover
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <Box sx={{ p: 3, minWidth: 300 }}>
        <Typography variant="h6">View Settings</Typography>
        <TextField
          label="View Name"
          variant="outlined"
          size="small"
          fullWidth
          margin="normal"
          value={newName}
          onChange={handleNewNameChange}
          onBlur={handleNewNameBlur}
        />
        <FormControl variant="outlined" size="small" fullWidth margin="normal">
          <InputLabel>View Type</InputLabel>
          <Select
            label="View Type"
            value={view?.type.toUpperCase() || ""}
            onChange={(e) => onViewTypeChange?.(e.target.value as string)}
          >
            <MenuItem value="KANBAN">Kanban</MenuItem>
            <MenuItem value="TABLE" disabled>
              Table
            </MenuItem>
            <MenuItem value="LIST">
              List
            </MenuItem>
            <MenuItem value="TIMELINE" disabled>
              Timeline
            </MenuItem>
            <MenuItem value="CALENDAR" disabled>
              Calendar
            </MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined" size="small" fullWidth margin="normal">
          <InputLabel>Group By</InputLabel>
          <Select
            label="Group By"
            value={view?.config?.group_by || ""}
            onChange={(e) => onGroupByChange?.(e.target.value as string)}
          >
            {propertyDefinitions?.map((prop) => (
              <MenuItem key={prop.id} value={prop.id}>
                {prop.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="error"
            fullWidth
            onClick={onDeleteView}
          >
            Delete View
          </Button>
        </Box>
      </Box>
    </Popover>
  );
};
