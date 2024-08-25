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
import { TaskProperty } from "./TaskProperty";

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

  const handleAddClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAddProperty = (type: string) => {
    const defaultName = `New ${type} Property`;
    const defaultValue = type === "Text" ? "" : type === "Select" ? "Option 1" : "";

    onAddProperty?.(defaultName, type, defaultValue);
    handleMenuClose();
  };

  const handleEditProperty = () => {
    
  };

  const handleDeleteProperty = (id: string) => {
    onPropertyDelete?.(id);
    handleMenuClose();
  };

  const handlePropertyValueChange = (propertyId: string, newValue: any) => {
    onPropertyChange?.(propertyId, newValue);
  };

  return (
    <>
      {propertiesWithDefinitions.map(prop => (
        <TaskProperty 
            key={prop.definition.id}
            propertyWithDefinition={prop}
            onEditProperty={handleEditProperty}
            onPropertyChange={handlePropertyValueChange}
            onPropertyDelete={handleDeleteProperty}
        />
      ))}
      <Button variant="outlined" onClick={handleAddClick} sx={{ alignSelf: "flex-start", mt: 2 }}>
        Add Property
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => handleAddProperty("Text")}>Text</MenuItem>
        <MenuItem onClick={() => handleAddProperty("Select")}>Select</MenuItem>
        {/* Add more property types here if needed */}
      </Menu>
    </>
  );
};
