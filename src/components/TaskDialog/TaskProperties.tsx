import React, { useState } from "react";
import {
  Button,
  TextField,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { PropertyWithDefinition } from "@/src/containers/TaskPropertiesContainer";


interface TaskPropertiesProps {
  propertiesWithDefinitions: PropertyWithDefinition[];
  onPropertyChange?: (propertyName: string, newValue: any) => void;
  onAddProperty?: (name: string, type: string, value: any) => void;
  onEditProperty?: () => void;
  onPropertyDelete?: () => void;
}

export const TaskProperties: React.FC<TaskPropertiesProps> = ({
    propertiesWithDefinitions,
    onPropertyChange,
}) => {
  const [newPropertyType, setNewPropertyType] = useState("");
  const [newPropertyName, setNewPropertyName] = useState("");
  const [newPropertyValue, setNewPropertyValue] = useState("");
  const [showNewPropertyForm, setShowNewPropertyForm] = useState(false);

  const handlePropertyChange = (propertyName: string, newValue: any) => {
    onPropertyChange?.(propertyName, newValue)
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
                    handlePropertyChange(
                    prop.definition.name,
                    e.target.value,
                    )
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
                    handlePropertyChange(
                        prop.definition.name,
                        e.target.value,
                    )
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
            onClick={() => setShowNewPropertyForm(!showNewPropertyForm)}
            sx={{ alignSelf: "flex-start" }}
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
            />
            <Button
                variant="contained"
                onClick={handleAddProperty}
                sx={{ alignSelf: "flex-start" }}
            >
                Add
            </Button>
            </Box>
        )}
    </>
  );
};
