'use client'

import React from 'react';
import { Task } from '../types';

interface TableViewProps {
  tasks: Task[];
}

const TableView: React.FC<TableViewProps> = ({ tasks }) => {
  return (
    <div>
      <h2>Table View</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            {/* add other columns as needed */}
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id}>
              <td>{task.id}</td>
              <td>{task.title}</td>
              {/* add other columns as needed */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableView;
