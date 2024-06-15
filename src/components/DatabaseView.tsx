'use client'

import React, { useEffect, useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import TableView from './TableView';
import { Task } from '../types';
import KanbanView from './KanbanView';
import ListView from './ListView';
import { useGetDatabaseById, useGetDatabaseTasks } from '../hooks/useTasks';


interface DatabaseViewProps {
  tasks: Task[];
}

const DatabaseView: React.FC<DatabaseViewProps> = ({ tasks }) => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setSelectedTab(newValue);
  };

  const { data } = useGetDatabaseTasks('tC55EemN4FV8zJhgVMs0');
  // useEffect(() => {

  // }, [database, t])

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
      >
        {data?.views.map(databaseView => <Tab key={databaseView.name} label={databaseView.name} /> )}
      </Tabs>
      <Box sx={{ p: 3 }}>
        {data?.views.map(databaseView => {
          if (databaseView.type === 'kanban') return <KanbanView key={databaseView.name} databaseId={data?.id} databaseView={databaseView} />
          return <>View type not supported</>
        })}
      </Box>
    </Box>
  );
};

export default DatabaseView;
