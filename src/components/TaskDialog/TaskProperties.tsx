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

interface TaskPropertiesProps {
  propertiesWithDefinitions: PropertyWithDefinition[];
  onPropertyChange?: (propertyName: string, newValue: any) => void;
  onAddProperty?: (name: string, type: string, value: any) => void;
  onEditProperty?: (id: string, changes: Partial<DatabasePropertyDefinition>) => void;
  onPropertyDelete?: (id: string) => void;
}

export const TaskProperties: React.FC<TaskPropertiesProps> = ({
  propertiesWithDefinitions,
  onPropertyChange,
  onAddProperty,
  onEditProperty,
  onPropertyDelete,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [editMenuAnchorEl, setEditMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedProperty, setSelectedProperty] = useState<null | PropertyWithDefinition>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleAddClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setEditMenuAnchorEl(null);
    setIsEditing(false);
  };

  const handleAddProperty = (type: string) => {
    const defaultName = `New ${type} Property`;
    const defaultValue = type === "Text" ? "" : type === "Select" ? "Option 1" : "";

    onAddProperty?.(defaultName, type, defaultValue);
    handleMenuClose();
  };

  const handlePropertyNameClick = (event: React.MouseEvent<HTMLElement>, prop: PropertyWithDefinition) => {
    setSelectedProperty(prop);
    setEditMenuAnchorEl(event.currentTarget);
  };

  const handleEditProperty = () => {
    setIsEditing(true);
  };

  const handlePropertyChange = (newValue: any) => {
    if (selectedProperty) {
      onPropertyChange?.(selectedProperty.definition.name, newValue);
    }
    handleMenuClose();
  };

  const handleDeleteProperty = () => {
    if (selectedProperty) {
      onPropertyDelete?.(selectedProperty.definition.id);
    }
    handleMenuClose();
  };

  return (
    <>
      {propertiesWithDefinitions.map((prop, index) => (
        <Box key={index} sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body1"
              onClick={(e) => handlePropertyNameClick(e, prop)}
              sx={{ cursor: "pointer", textDecoration: "underline" }}
            >
              {prop.definition.name}
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2">{prop.value}</Typography>
          </Box>
        </Box>
      ))}
      <Button variant="outlined" onClick={handleAddClick} sx={{ alignSelf: "flex-start", mt: 2 }}>
        Add Property
      </Button>
      <Menu anchorEl={editMenuAnchorEl} open={Boolean(editMenuAnchorEl) && !isEditing} onClose={handleMenuClose}>
        <MenuItem onClick={handleEditProperty}>Edit</MenuItem>
        <MenuItem onClick={handleDeleteProperty}>Delete</MenuItem>
      </Menu>
      {isEditing && selectedProperty && (
        <Menu anchorEl={editMenuAnchorEl} open={Boolean(editMenuAnchorEl) && isEditing} onClose={handleMenuClose}>
          {selectedProperty.definition.type === "Text" && (
           <>Text edit menu</>
          )}
          {selectedProperty.definition.type === "Select" && (
            <>select edit menu</>
          )}
        </Menu>
      )}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => handleAddProperty("Text")}>Text</MenuItem>
        <MenuItem onClick={() => handleAddProperty("Select")}>Select</MenuItem>
        {/* Add more property types here if needed */}
      </Menu>
    </>
  );
};
