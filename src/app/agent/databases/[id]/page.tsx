"use client";

import {
  useGetDatabaseById,
  useGetDatabaseTasks,
  useGetDatabaseViews,
} from "@/src/hooks/react-query/database";
import {
  Box,
  Container,
  Paper,
  Tab,
  Tabs,
  Typography,
  IconButton,
  TextField,
  Menu,
  MenuItem,
} from "@mui/material";
import { Add, Search, FilterList, SwapVert } from "@mui/icons-material";
import { useParams } from "next/navigation";
import { useState } from "react";
import { AgentKanbanViewContainer } from "@/src/containers/AgentKanbanViewContainer";
import { useAddDatabaseView } from "@/src/hooks/react-query/database_view";
import { DatabaseView } from "@/src/types";
import { v4 as uuidv4 } from 'uuid';
import { useGetDatabasePropertyDefinitions } from "@/src/hooks/react-query/database_property_definition";

export default function Database() {
  const { id: databaseId } = useParams();
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(
    null,
  );
  const [addAnchorEl, setAddAnchorEl] = useState<null | HTMLElement>(null); // State for Add button menu
  
  const { data: database, isLoading: isLoadingDatabase } = useGetDatabaseById(
    databaseId as string,
  );
  const { data: views, isLoading: isLoadingViews } = useGetDatabaseViews(
    databaseId as string,
  );
  const selectedView = views?.find((view, i) => i === selectedTab);

  const { data: propertyDefinitions } = useGetDatabasePropertyDefinitions(databaseId as string);
  const addDatabaseViewMutation = useAddDatabaseView(databaseId as string);
  const { data: tasks } = useGetDatabaseTasks(databaseId as string)


  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setSelectedTab(newValue);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const handleSortClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setAnchorEl(null);
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleAddClick = (event: React.MouseEvent<HTMLElement>) => {
    setAddAnchorEl(event.currentTarget);
  };

  const handleAddClose = () => {
    setAddAnchorEl(null);
  };

  const handleAddOptionClick = (option: string) => {
    setAddAnchorEl(null);
    const firstSelectProperty = propertyDefinitions?.find(prop => prop.type === 'Select');
    console.warn(firstSelectProperty)
    if (firstSelectProperty) {
      const databaseView: DatabaseView = {  
        id: uuidv4(),
        database_id: databaseId as string,
        name: option,
        type: option,
        config: {
          filters: [],
          sorts: [],
          group_by: firstSelectProperty.id,
          groups: firstSelectProperty.data?.options?.map(option => ({
            group_by_value: option, task_order: tasks?.filter(task => task.properties[firstSelectProperty.id] === option).map(t => t.id) ?? []
          }))
        },
      }
      addDatabaseViewMutation.mutateAsync(databaseView);
    }
  };

  return (
    <Container component="main" maxWidth="xl">
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          p: 4,
          boxShadow:
            "rgba(0, 0, 0, 0.04) 0px 5px 22px, rgba(0, 0, 0, 0.03) 0px 0px 0px 0.5px",
        }}
      >
        <Typography component="h1" variant="h5">
          {isLoadingDatabase ? <>Loading...</> : database?.name}
        </Typography>
      </Paper>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pt: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          {isLoadingViews && <>Loading views...</>}
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            {views?.map((databaseView) => (
              <Tab key={databaseView.id} label={databaseView.name} />
            ))}
          </Tabs>
          <IconButton onClick={handleAddClick}>
            <Add />
          </IconButton>
          <Menu
            anchorEl={addAnchorEl}
            open={Boolean(addAnchorEl)}
            onClose={handleAddClose}
          >
            <MenuItem onClick={() => handleAddOptionClick("Kanban")}>
              Kanban
            </MenuItem>
            <MenuItem disabled>Table</MenuItem>
            <MenuItem disabled>List</MenuItem>
            <MenuItem disabled>Timeline</MenuItem>
            <MenuItem disabled>Calendar</MenuItem>
          </Menu>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
          {searchOpen && (
            <TextField
              variant="outlined"
              size="small"
              value={searchText}
              onChange={handleSearchChange}
              placeholder="Search..."
              sx={{ mr: 1 }}
            />
          )}
          <IconButton onClick={toggleSearch}>
            <Search />
          </IconButton>
          <IconButton onClick={handleSortClick}>
            <SwapVert />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleSortClose}
          >
            <MenuItem onClick={handleSortClose}>Sort by Date</MenuItem>
            <MenuItem onClick={handleSortClose}>Sort by Name</MenuItem>
          </Menu>
          <IconButton onClick={handleFilterClick}>
            <FilterList />
          </IconButton>
          <Menu
            anchorEl={filterAnchorEl}
            open={Boolean(filterAnchorEl)}
            onClose={handleFilterClose}
          >
            <MenuItem onClick={handleFilterClose}>Filter by Status</MenuItem>
            <MenuItem onClick={handleFilterClose}>Filter by Priority</MenuItem>
          </Menu>
        </Box>
      </Box>
      <Box sx={{ p: 3, width: "100%", overflowX: "scroll" }}>
        {selectedView && (
          <>
            {selectedView.type.toUpperCase() === "KANBAN" && (
              <AgentKanbanViewContainer
                readOnly={false}
                key={selectedView.id}
                databaseId={selectedView.database_id}
                databaseView={selectedView}
              />
            )}
          </>
        )}
      </Box>
    </Container>
  );
}
