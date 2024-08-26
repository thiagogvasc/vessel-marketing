import React from 'react';
import { MenuItem, TextField, Select } from '@mui/material';

interface TextPropertyEditProps {
  name: string;
  type: string;
  onNameChange: (name: string) => void;
  onTypeChange: (type: string) => void;
  onMetadataChange: (data: any) => void;
}

export const TextPropertyEdit: React.FC<TextPropertyEditProps> = ({ name, type, onNameChange, onTypeChange, onMetadataChange }) => {
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
    </>
  );
};