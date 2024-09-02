"use client";
import "./RequestsContainer.css";
import { useState } from "react";
import { useGetRequests } from "@/src/hooks/react-query/request";
import {
  Box,
  Typography,
  CircularProgress,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useTheme } from "@mui/material/styles";
import React from "react";
import {
  DataGrid,
  GridColDef,
  GridColumnHeaderParams,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import { CustomerCellContainer } from "./CustomerCellContainer";
import { CustomChip } from "../../components/CustomChip";
import { StyledPaper } from "../../components/StyledPaper";
import { ActionsCell } from "./ActionsCell";

export const RequestsContainer = () => {
  const { data: requests, isLoading } = useGetRequests();
  const theme = useTheme();

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      flex: 1,
    },
    {
      field: "title",
      headerName: "Title",
      headerClassName: "secondary-header",
      flex: 1,
    },
    {
      field: "client_id",
      headerName: "Client",
      minWidth: 300,
      align: "center",
      flex: 2,
      headerClassName: "secondary-header",
      renderCell: (params: GridRenderCellParams) => (
        <CustomerCellContainer client_id={params.value} />
      ),
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      headerClassName: "secondary-header",
      renderCell: (params: GridRenderCellParams) => (
        <CustomChip type="status" value={params.value} />
      ),
    },
    {
      field: "priority",
      headerName: "Priority",
      minWidth: 130,
      flex: 1,
      headerClassName: "secondary-header",
      renderCell: (params: GridRenderCellParams) => (
        <CustomChip type="priority" value={params.value} />
      ),
    },
    {
      field: "assigned_to",
      headerName: "Assignee",
      minWidth: 150,
      flex: 2,
      headerClassName: "secondary-header",
      renderCell: (params: GridRenderCellParams) => (
        <CustomerCellContainer client_id={params.value} />
      ),
    },
    {
      field: "created_at",
      headerName: "Created At",
      minWidth: 130,
      flex: 1,
      headerClassName: "secondary-header",
      valueGetter: (params: any) => {
        return new Date(params).toLocaleDateString();
      },
    },
    {
      field: "actions",
      renderHeader: (params: GridColumnHeaderParams<any>) => <></>,
      width: 100,
      renderCell: (params: GridRenderCellParams<any>) => (
        <ActionsCell requestId={params.row.id} />
      ),
    },
  ];

  const rows = requests?.map((request) => ({
    id: request.id,
    title: request.title,
    client_id: request.client_id,
    status: request.status,
    priority: request.priority,
    assigned_to: request.assigned_to,
    created_at: request.created_at,
  }));

  return (
    <>
      <Typography component="h1" variant="h5">
        Requests
      </Typography>
      <StyledPaper>
        <TextField
          variant="outlined"
          margin="normal"
          placeholder="Search requests"
          sx={{
            m: 2,
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                border: "1px solid rgb(239, 241, 245)", // Default border color
              },
              borderRadius: "10px",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: theme.palette.grey[500] }} />
              </InputAdornment>
            ),
          }}
        />
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ height: 600, width: "100%" }}>
            <DataGrid
              rows={rows ?? []}
              columns={columns}
              getRowHeight={() => "auto"}
              rowSpacingType="border"
              sx={{
                border: "none", // Removes the outer border
                "& .MuiDataGrid-row--borderBottom .MuiDataGrid-columnHeader": {
                  border: "none",
                },
                "& .MuiDataGrid-columnHeader": {
                  backgroundColor: "#F4F6F8",
                },
                "& .MuiDataGrid-cell": {
                  border: "none",
                  padding: "16px",
                  display: "flex",
                  justifyContent: "start",
                  alignItems: "center",
                },
                "& .MuiDataGrid-row": {
                  borderBottomColor: "rgb(145 158 171 / 20%)",
                  borderBottomStyle: "dashed",
                  borderBottomWidth: "1px",
                  borderBottomSpacing: "2px",
                },
                "& .MuiDataGrid-filler > *": {
                  border: "none",
                },
              }}
            />
          </Box>
        )}
      </StyledPaper>
    </>
  );
};
