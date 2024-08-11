'use client'

import KanbanView from "@/src/components/KanbanView";
import { useGetDatabaseWithTasks } from "@/src/hooks/useTasks";
import { Task } from "@/src/types";
import { Box, Container, Paper, Tab, Tabs, Typography, IconButton, TextField, Menu, MenuItem } from "@mui/material";
import { Add, Search, FilterList, Sort, SwapVert } from "@mui/icons-material";
import { Timestamp } from "firebase/firestore";
import { useParams } from "next/navigation";
import { useState } from "react";


export default function Database() {
  const { id: databaseId } = useParams();
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setSelectedTab(newValue);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const addNewTab = () => {
    // Implement the logic to add a new tab
    console.log("Add new tab");
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

  const { data } = useGetDatabaseWithTasks(databaseId as string);

  return (
    <Container component="main" maxWidth="xl">
      <Paper elevation={0} sx={{ borderRadius: 2, p: 4, boxShadow: 'rgba(0, 0, 0, 0.04) 0px 5px 22px, rgba(0, 0, 0, 0.03) 0px 0px 0px 0.5px' }}>
        <Typography component="h1" variant="h5">{data?.name}</Typography>
      </Paper>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            {data?.views.map(databaseView => <Tab key={databaseView.name} label={databaseView.name} />)}
          </Tabs>
          <IconButton onClick={addNewTab}>
            <Add />
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
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
      <Box sx={{ p: 3, width: '100%', overflowX: 'scroll' }}>
        {data?.views.map(databaseView => {
          if (databaseView.type === 'kanban') return <KanbanView readOnly={false} key={databaseView.name} databaseId={data?.id} databaseView={databaseView} />
          return <>View type not supported</>
        })}
      </Box>
    </Container>
  );
}
