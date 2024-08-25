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
import { Task as TaskType } from "../../types";
import { PropertyWithDefinition } from "@/src/containers/TaskDialogContainer";

export interface TaskWithId extends TaskType {
  id: string;
}

interface TaskDialogProps {
  task: TaskWithId;
  TaskCommentsComponent: React.ReactNode;
  propertiesWithDefinitions: PropertyWithDefinition[];
  open: boolean;
  onClose: () => void;
  onSave: (
    newTitle: string,
    newDescription: string,
    newPropertiesWithDefinitions: PropertyWithDefinition[],
  ) => void;
  onDelete: () => void;
  readOnly: boolean;
}

const TaskDialog: React.FC<TaskDialogProps> = ({
  task,
  TaskCommentsComponent,
  propertiesWithDefinitions,
  open,
  onClose,
  onSave,
  onDelete,
  readOnly,
}) => {
  const [newTitle, setNewTitle] = useState(task.title);
  const [newDescription, setNewDescription] = useState(task.description);
  const [newPropertiesWithDefinitions, setNewPropertiesWithDefinitions] =
    useState<PropertyWithDefinition[]>(propertiesWithDefinitions);
  const [newPropertyType, setNewPropertyType] = useState("");
  const [newPropertyName, setNewPropertyName] = useState("");
  const [newPropertyValue, setNewPropertyValue] = useState("");
  const [showNewPropertyForm, setShowNewPropertyForm] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleSave = () => {
    onSave(newTitle, newDescription, newPropertiesWithDefinitions);
    onClose();
  };

  const handlePropertyChange = (propertyName: string, newValue: any) => {
    setNewPropertiesWithDefinitions(
      newPropertiesWithDefinitions.map((prop) =>
        prop.definition.name === propertyName
          ? { ...prop, value: newValue }
          : prop,
      ),
    );
  };

  const handleAddProperty = () => {
    // setNewPropertiesWithDefinitions([
    //   ...newPropertiesWithDefinitions,
    //   {
    //     definition: {
    //       name: newPropertyName,
    //       type: newPropertyType as PropertyType,
    //     },
    //     value: newPropertyValue,
    //   },
    // ]);
    // setNewPropertyType("");
    // setNewPropertyName("");
    // setNewPropertyValue("");
    // setShowNewPropertyForm(false);
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
              fullWidth
              variant="outlined"
              disabled={readOnly}
            />
            <Box sx={{ display: "flex", gap: 4 }}>
              <TextField
                label="Description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
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
                {newPropertiesWithDefinitions.map((prop, index) => (
                  <Box
                    key={index}
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    {prop.definition.type === "Text" && (
                      <TextField
                        label={prop.definition.name}
                        value={prop.value}
                        onChange={(e) =>
                          handlePropertyChange(
                            prop.definition.name,
                            e.target.value,
                          )
                        }
                        fullWidth
                        disabled={readOnly}
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
                            handlePropertyChange(
                              prop.definition.name,
                              e.target.value,
                            )
                          }
                          fullWidth
                          disabled={readOnly}
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
                  onClick={() => setShowNewPropertyForm(!showNewPropertyForm)}
                  sx={{ alignSelf: "flex-start" }}
                  disabled={readOnly}
                >
                  Add Property
                </Button>
                {showNewPropertyForm && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      mt: 2,
                    }}
                  >
                    <TextField
                      label="Property Name"
                      value={newPropertyName}
                      onChange={(e) => setNewPropertyName(e.target.value)}
                      fullWidth
                      disabled={readOnly}
                    />
                    <FormControl fullWidth>
                      <InputLabel id="new-property-type-label">
                        Property Type
                      </InputLabel>
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
                      sx={{ alignSelf: "flex-start" }}
                      disabled={readOnly}
                    >
                      Add
                    </Button>
                  </Box>
                )}
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
