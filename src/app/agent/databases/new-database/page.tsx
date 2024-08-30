"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { CreateDatabasePayload, PropertyType } from "@/src/types";
import { useAddDatabase } from "@/src/hooks/react-query/database";
import { v4 as uuidv4 } from "uuid";

const NewDatabase = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState(""); // Added state for description
  const [viewType, setViewType] = useState("Kanban View");
  const [clientId, setClientId] = useState("");
  const addDatabaseMutation = useAddDatabase();

  const handleAddDatabase = async () => {
    try {
      const database_id = uuidv4();
      const statusPropertyId = uuidv4();
      const createDatabasePayload: CreateDatabasePayload = {
        id: database_id,
        name: name,
        ...(clientId.length > 0 && { client_id: clientId }),
        description: description, // Use description state here
        propertyDefinitions: [
          {
            id: statusPropertyId,
            database_id,
            name: "status",
            type: PropertyType.Select,
            data: {
              options: ["To Do", "In Progress", "Done"],
            },
          },
        ],
        views: [
          {
            id: uuidv4(),
            database_id,
            name: "My Kanban View",
            type: "kanban",
            config: {
              filters: [],
              sorts: [],
              group_by: statusPropertyId,
              groups: ["To Do", "In Progress", "Done"],
            },
          },
        ],
      };
      addDatabaseMutation.mutateAsync(createDatabasePayload).then(() => {
        router.push("/agent/databases");
      });
    } catch (error) {
      console.error("Failed to add database:", error);
    }
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ pt: 12 }}>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12}>
          <Typography component="h1" variant="h5" textAlign="center">
            Add Project
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Description" // Added description field
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Initial View Type</InputLabel>
            <Select
              value={viewType}
              onChange={(e) => setViewType(e.target.value)}
              label="Initial View Type"
            >
              <MenuItem value="Kanban View">Kanban View</MenuItem>
              <MenuItem value="Table View" disabled>
                Table View
              </MenuItem>
              <MenuItem value="List View" disabled>
                List View
              </MenuItem>
              <MenuItem value="Calendar View" disabled>
                Calendar View
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Client ID"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            fullWidth
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} textAlign="center">
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddDatabase}
          >
            Add Project
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default NewDatabase;
