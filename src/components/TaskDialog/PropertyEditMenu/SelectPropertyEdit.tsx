import React, { useState } from "react";
import { MenuItem, TextField, Select, Button, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

interface SelectPropertyEditProps {
  name: string;
  type: string;
  options: string[];
  onNameChange: (name: string) => void;
  onTypeChange: (type: string) => void;
  onMetadataChange: (data: any) => void;
}

export const SelectPropertyEdit: React.FC<SelectPropertyEditProps> = ({
  name,
  type,
  options,
  onNameChange,
  onTypeChange,
  onMetadataChange,
}) => {
  const handleAddOption = () => {
    //onOptionsChange([...options, '']);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    //onOptionsChange(newOptions);
  };

  const handleDeleteOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    //onOptionsChange(newOptions);
  };

  return (
    <>
      <TextField
        label="Property Name"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        fullWidth
      />
      <Select
        native
        value={type}
        onChange={(e) => onTypeChange(e.target.value)}
        fullWidth
      >
        <option value="Text">Text</option>
        <option value="Select">Select</option>
        {/* Add other options as needed */}
      </Select>
      <Button onClick={handleAddOption} startIcon={<AddIcon />}>
        Add Option
      </Button>
      {options.map((option, index) => (
        <MenuItem key={index}>
          <TextField
            label={`Option ${index + 1}`}
            value={option}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            fullWidth
          />
          <IconButton onClick={() => handleDeleteOption(index)}>
            <DeleteIcon />
          </IconButton>
        </MenuItem>
      ))}
    </>
  );
};
