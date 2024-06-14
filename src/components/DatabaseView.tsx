'use client'

import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import TableView from './TableView';
import { Task } from '../types';
import KanbanView from './KanbanView';
import ListView from './ListView';


interface DatabaseViewProps {
  tasks: Task[];
}

const DatabaseView: React.FC<DatabaseViewProps> = ({ tasks }) => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="Kanban" />
        <Tab label="Table" />
        <Tab label="List"/>
        <Tab label="Gantt" disabled/>
        <Tab label="Calendar" disabled/>
      </Tabs>
      <Box sx={{ p: 3 }}>
        {selectedTab === 0 && <KanbanView tasks={tasks} />}
        {selectedTab === 1 && <TableView tasks={tasks} />}
        {selectedTab === 2 && <ListView tasks={tasks} />}
        {/* {selectedTab === 3 && <GanttView tasks={tasks} />} */}
        {/* {selectedTab === 4 && <CalendarView tasks={tasks} />} */}
      </Box>
    </Box>
  );
};

export default DatabaseView;
