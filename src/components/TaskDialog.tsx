import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogActions, Button, TextField, Box, MenuItem, Select, InputLabel, FormControl, IconButton, Menu, MenuItem as MenuOption } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { DatabasePropertyDefinition, PropertyType, Task as TaskType } from '../types';
import { useGetDatabaseWithTasks } from '../hooks/useTasks';
import { TaskComments } from './TaskComments';

export interface TaskWithId extends TaskType {
  id: string;
}

interface TaskDialogProps {
  task: TaskWithId;
  open: boolean;
  onClose: () => void;
  onSave: (updatedTask: TaskWithId) => void;
  onDelete: (task: TaskType) => void;
  readOnly: boolean;
  onCommentAdded?: (commentText: string) => void;
}

const TaskDialog: React.FC<TaskDialogProps> = ({ task, open, onClose, onSave, onDelete, readOnly, onCommentAdded }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [properties, setProperties] = useState<{ propertyDefinition: DatabasePropertyDefinition, propertyValue: any }[]>([]);
  const [newPropertyType, setNewPropertyType] = useState('');
  const [newPropertyName, setNewPropertyName] = useState('');
  const [newPropertyValue, setNewPropertyValue] = useState('');
  const [showNewPropertyForm, setShowNewPropertyForm] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const { data: databaseWithTasks } = useGetDatabaseWithTasks(task?.database_id);

  useEffect(() => {
    const propDefinitions = databaseWithTasks?.propertyDefinitions;
    const props = task?.properties;
    if (!props) return;

    const properties: { propertyDefinition: DatabasePropertyDefinition, propertyValue: any }[] = [];

    Object.entries(props).forEach(([key, value]) => {
      const [propertyName, propertyValue] = [key, value];
      const propertyDefinition = propDefinitions?.find(propDef => propDef.name === propertyName);
      propertyDefinition && properties.push({ propertyDefinition, propertyValue });
    });
    setProperties(properties);
  }, [databaseWithTasks, task]);

  const handleSave = () => {
    if (task) {
      const updatedProperties = properties.reduce((acc, prop) => {
        acc[prop.propertyDefinition.name] = prop.propertyValue;
        return acc;
      }, {} as { [key: string]: any });

      onSave({ ...task, title, description, properties: updatedProperties });
    }
    onClose();
  };

  const handlePropertyChange = (propertyName: string, newValue: any) => {
    setProperties(properties.map(prop =>
      prop.propertyDefinition.name === propertyName ? { ...prop, propertyValue: newValue } : prop
    ));
  };

  const handleAddProperty = () => {
    setProperties([...properties, {
      propertyDefinition: { name: newPropertyName, type: newPropertyType as PropertyType },
      propertyValue: newPropertyValue
    }]);
    setNewPropertyType('');
    setNewPropertyName('');
    setNewPropertyValue('');
    setShowNewPropertyForm(false);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    if (task) {
      onDelete(task);
    }
    onClose();
  };

  const handleCommentAdded = (commentText: string) => onCommentAdded?.(commentText);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
            <TextField
              label="Title"
              size="small"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              variant="outlined"
              disabled={readOnly}
            />
            <Box sx={{ display: 'flex', gap: 4 }}>
              <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={10}
                fullWidth
                disabled={readOnly}
                sx={{ flex: 7 }}
              />
              <Box sx={{ flex: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {properties.map((prop, index) => (
                  <Box key={index} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {prop.propertyDefinition.type === 'Text' && (
                      <TextField
                        label={prop.propertyDefinition.name}
                        value={prop.propertyValue}
                        onChange={(e) => handlePropertyChange(prop.propertyDefinition.name, e.target.value)}
                        fullWidth
                        disabled={readOnly}
                      />
                    )}
                    {prop.propertyDefinition.type === 'Select' && (
                      <FormControl fullWidth>
                        <InputLabel id={`${prop.propertyDefinition.name}-label`}>{prop.propertyDefinition.name}</InputLabel>
                        <Select
                          labelId={`${prop.propertyDefinition.name}-label`}
                          value={prop.propertyValue}
                          onChange={(e) => handlePropertyChange(prop.propertyDefinition.name, e.target.value)}
                          fullWidth
                          disabled={readOnly}
                        >
                          {prop.propertyDefinition.data?.options?.map(option => (
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
                  onClick={() => setShowNewPropertyForm(!showNewPropertyForm)}
                  sx={{ alignSelf: 'flex-start' }}
                  disabled={readOnly}
                >
                  Add Property
                </Button>
                {showNewPropertyForm && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                    <TextField
                      label="Property Name"
                      value={newPropertyName}
                      onChange={(e) => setNewPropertyName(e.target.value)}
                      fullWidth
                      disabled={readOnly}
                    />
                    <FormControl fullWidth>
                      <InputLabel id="new-property-type-label">Property Type</InputLabel>
                      <Select
                        labelId="new-property-type-label"
                        value={newPropertyType}
                        onChange={(e) => setNewPropertyType(e.target.value)}
                        fullWidth
                        disabled={readOnly}
                      >
                        <MenuItem value="Text">Text</MenuItem>
                        <MenuItem value="Select">Select</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      label="Property Value"
                      value={newPropertyValue}
                      onChange={(e) => setNewPropertyValue(e.target.value)}
                      fullWidth
                      disabled={readOnly}
                    />
                    <Button
                      variant="contained"
                      onClick={handleAddProperty}
                      sx={{ alignSelf: 'flex-start' }}
                      disabled={readOnly}
                    >
                      Add
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>
            <Box>
              <TaskComments
                comments={task?.comments ?? []}
                commentAdded={handleCommentAdded}
              />
            </Box>
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
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" disabled={readOnly}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskDialog;
