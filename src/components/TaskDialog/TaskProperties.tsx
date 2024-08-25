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
  onPropertyDelete
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAddProperty = (type: string) => {
    const defaultName = `New ${type} Property`;
    const defaultValue = type === "Text" ? "" : type === "Select" ? "Option 1" : "";
    
    onAddProperty?.(defaultName, type, defaultValue);
    handleClose();
  };

  return (
    <>
      {propertiesWithDefinitions.map((prop, index) => (
        <Box
          key={index}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          {prop.definition.type === "Text" && (
            <TextField
              label={prop.definition.name}
              value={prop.value}
              onChange={(e) =>
                onPropertyChange?.(prop.definition.name, e.target.value)
              }
              fullWidth
            />
          )}
          {prop.definition.type === "Select" && (
            <FormControl fullWidth>
              <InputLabel id={`${prop.definition.name}-label`}>
                {prop.definition.name}
              </InputLabel>
              <Select
                labelId={`${prop.definition.name}-label`}
                value={prop.value}
                onChange={(e) =>
                  onPropertyChange?.(prop.definition.name, e.target.value)
                }
                fullWidth
              >
                {prop.definition.data?.options?.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>
      ))}
      <Button
        variant="outlined"
        onClick={handleClick}
        sx={{ alignSelf: "flex-start" }}
      >
        Add Property
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleAddProperty("Text")}>Text</MenuItem>
        <MenuItem onClick={() => handleAddProperty("Select")}>Select</MenuItem>
        {/* Add more property types here if needed */}
      </Menu>
    </>
  );
};
