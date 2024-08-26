import React from 'react';
import { Menu, Popover } from '@mui/material';
import { TextPropertyEdit } from './TextPropertyEdit';
import { SelectPropertyEdit } from './SelectPropertyEdit';

interface PropertyEditPopoverProps {
  anchorEl: HTMLElement | null;
  isOpen: boolean;
  onClose: () => void;
  definition: { type: string; name: string };
  onNameChange: (name: string) => void;
  onTypeChange: (type: string) => void;
  onMetadataChange: (data: any) => void;
}

export const PropertyEditPopover: React.FC<PropertyEditPopoverProps> = ({
  anchorEl,
  isOpen,
  onClose,
  definition,
  onNameChange,
  onTypeChange,
  onMetadataChange,
}) => {
  return (
    <Popover anchorEl={anchorEl} open={isOpen} onClose={onClose}>
      {definition.type === 'Text' && (
        <TextPropertyEdit
          name={definition.name}
          type={definition.type}
          onNameChange={onNameChange}
          onTypeChange={onTypeChange}
          onMetadataChange={onMetadataChange}
        />
      )}
      {definition.type === 'Select' && (
        <SelectPropertyEdit
          name={definition.name}
          type={definition.type}
          options={[]}
          onNameChange={onNameChange}
          onTypeChange={onTypeChange}
          onMetadataChange={onMetadataChange}
        />
      )}
      {/* Add more cases as you introduce new types */}
    </Popover>
  );
};