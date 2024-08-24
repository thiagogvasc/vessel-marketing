"use client";

import React, { useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { Column } from "./Column";
import { AggregateColumn } from "../../types";
import { Box, IconButton, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { TaskWithId } from "./Task";

interface KanbanViewProps {
  readOnly: boolean;
  columns: AggregateColumn[];
  taskAdded?: (columnTitle: string, newTaskTitle: string) => void;
  taskClicked?: (taskClicked: TaskWithId) => void;
  taskDragged?: (result: any) => void;
  columnDeleted?: (columnTitle: string) => void;
  columnAdded?: (newColumnTitle: string) => void;
}

export const KanbanView: React.FC<KanbanViewProps> = ({
  readOnly,
  columns,
  taskDragged,
  columnAdded,
  columnDeleted,
  taskAdded,
  taskClicked,
}) => {
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [isAddingColumn, setIsAddingColumn] = useState(false);

  const handleTaskDragged = (result: any) => {
    taskDragged?.(result);
  };

  const handleColumnAdded = () => {
    if (newColumnTitle.trim() === "") return;
    columnAdded?.(newColumnTitle);
  };

  const handleColumnTitleBlur = () => {
    if (newColumnTitle.trim() !== "") {
      handleColumnAdded();
    } else {
      setIsAddingColumn(false);
    }
  };

  const handleColumnTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleColumnAdded();
    } else if (e.key === "Escape") {
      setIsAddingColumn(false);
    }
  };

  const handleTaskClicked = (task: TaskWithId) => {
    taskClicked?.(task);
  };

  const handleTaskAdded = (columnTitle: string, newTaskTitle: string) => {
    taskAdded?.(columnTitle, newTaskTitle);
  };

  const handleColumnDeleted = (columnTitle: string) => {
    columnDeleted?.(columnTitle);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <DragDropContext onDragEnd={handleTaskDragged}>
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
          {columns.map((column) => (
            <Box key={column.title} sx={{ minWidth: 300 }}>
              <Column
                readOnly={readOnly}
                column={column}
                taskAdded={handleTaskAdded}
                columnDeleted={handleColumnDeleted}
                taskClicked={handleTaskClicked}
              />
            </Box>
          ))}
          <Box sx={{ minWidth: 300 }}>
            {isAddingColumn ? (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <TextField
                  placeholder="Column title"
                  value={newColumnTitle}
                  onChange={(e) => setNewColumnTitle(e.target.value)}
                  onBlur={handleColumnTitleBlur}
                  onKeyDown={handleColumnTitleKeyDown}
                  variant="outlined"
                  size="small"
                  sx={{ flex: 1 }}
                  autoFocus
                />
                <IconButton color="primary" onClick={handleColumnAdded}>
                  <AddIcon />
                </IconButton>
              </Box>
            ) : (
              <IconButton
                color="primary"
                onClick={() => setIsAddingColumn(true)}
              >
                <AddIcon />
              </IconButton>
            )}
          </Box>
        </Box>
      </DragDropContext>
    </Box>
  );
};
