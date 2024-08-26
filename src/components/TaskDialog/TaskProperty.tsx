import React, { useState } from "react";
import {
  Button,
  Box,
  Menu,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Typography,
} from "@mui/material";
import { PropertyWithDefinition } from "@/src/containers/TaskPropertiesContainer";
import { DatabasePropertyDefinition } from "@/src/types";
import { PropertyEditPopover } from "./PropertyEditMenu/PropertyEditPopover";

interface TaskPropertiyProps {
  propertyWithDefinition: PropertyWithDefinition;
  onPropertyChange?: (propertyId: string, newValue: any) => void;
  onEditProperty?: (
    id: string,
    changes: Partial<DatabasePropertyDefinition>,
  ) => void;
  onPropertyDelete?: (id: string) => void;
}

export const TaskProperty: React.FC<TaskPropertiyProps> = ({
  propertyWithDefinition,
  onPropertyChange,
  onEditProperty,
  onPropertyDelete,
}) => {
  const { value, definition } = propertyWithDefinition;
  const [editMenuAnchorEl, setEditMenuAnchorEl] = useState<null | HTMLElement>(
    null,
  );
  const [isEditingValue, setIsEditingValue] = useState(false);
  const [isEditingProperty, setIsEditingProperty] = useState(false);
  const [newPropertyValue, setNewPropertyValue] = useState<any>(
    propertyWithDefinition.value,
  );

  const handleMenuClose = () => {
    setEditMenuAnchorEl(null);
    setIsEditingProperty(false);
  };

  const handlePropertyNameClick = (event: React.MouseEvent<HTMLElement>) => {
    setEditMenuAnchorEl(event.currentTarget);
  };

  const handleEditProperty = () => {
    setIsEditingProperty(true);
  };

  const handleDeleteProperty = () => {
    onPropertyDelete?.(definition.id);
    handleMenuClose();
  };

  const handlePropertyValueClick = () => {
    setIsEditingValue(true);
  };

  const handleSelectPropertyValueChange = (e: any) => {
    onPropertyChange?.(definition.id, e.target.value);
    setIsEditingValue(false);
  };

  const handleTextPropertyValueChange = (e: any) => {
    setNewPropertyValue(e.target.value);
  };
  const handleTextPropertyValueBlur = () => {
    onPropertyChange?.(definition.id, newPropertyValue);
    setIsEditingValue(false);
  };

  const handleNameChange = () => {};

  const handleTypeChange = () => {};

  const handleMetadataChange = () => {};

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="body1"
            onClick={handlePropertyNameClick}
            sx={{ cursor: "pointer", textDecoration: "underline" }}
          >
            {definition.name}
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }}>
          {isEditingValue ? (
            definition.type === "Text" ? (
              <TextField
                value={newPropertyValue}
                onChange={handleTextPropertyValueChange}
                onBlur={handleTextPropertyValueBlur}
                autoFocus
                fullWidth
              />
            ) : definition.type === "Select" ? (
              <FormControl fullWidth>
                <InputLabel id={`${definition.id}-edit-label`}>
                  Select
                </InputLabel>
                <Select
                  labelId={`${definition.id}-edit-label`}
                  value={value}
                  onChange={handleSelectPropertyValueChange}
                  autoFocus
                  fullWidth
                >
                  {definition.data?.options?.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <Typography variant="body2">{value}</Typography> // Default to display mode if type isn't handled
            )
          ) : (
            <Typography
              variant="body2"
              onClick={handlePropertyValueClick}
              sx={{ cursor: "pointer" }}
            >
              {value || "No value"}
            </Typography>
          )}
        </Box>
      </Box>
      <Menu
        anchorEl={editMenuAnchorEl}
        open={Boolean(editMenuAnchorEl) && !isEditingProperty}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditProperty}>Edit</MenuItem>
        <MenuItem onClick={handleDeleteProperty}>Delete</MenuItem>
      </Menu>

      <PropertyEditPopover
        anchorEl={editMenuAnchorEl}
        isOpen={isEditingProperty}
        onClose={handleMenuClose}
        definition={definition}
        onNameChange={handleNameChange}
        onTypeChange={handleTypeChange}
        onMetadataChange={handleMetadataChange}
      />
    </>
  );
};
