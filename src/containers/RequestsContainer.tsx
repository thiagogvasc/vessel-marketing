"use client";

import { useEffect, useState } from "react";
import { useGetRequests } from "@/src/hooks/react-query/request";
import {
  Box,
  Typography,
  CircularProgress,
  TextField,
  InputAdornment,
  Paper,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/navigation";
import { Request } from "@/src/types";
import { useTheme } from "@mui/material/styles";
import React from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import MoreVert from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

export const RequestsContainer = () => {
  const router = useRouter();
  const { data: requests, isLoading } = useGetRequests();
  const [searchTerm, setSearchTerm] = useState("");

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuRequestId, setMenuRequestId] = useState<null | string>(null);
  const isMenuOpen = Boolean(anchorEl);

  const theme = useTheme();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuOpen = (
    requestId: string,
    event: React.MouseEvent<HTMLElement>
  ) => {
    setMenuRequestId(requestId);
    setAnchorEl(event.currentTarget);
  };

  const priorityColor = (priority: string) => {
    if (priority === "Low") return {color: '#637381', backgroundColor: 'rgba(145, 158, 171, 0.16)'};
    else if (priority === "Medium") return { color: '#B76E00', backgroundColor: '#FFF5CC'};
    else if (priority === "High") return { color: 'rgb(183, 29, 24)', backgroundColor: 'rgba(255, 86, 48, 0.16)'};
  };

  const statusToColor = (status: string) => {
    if (status === "Pending") return {color: '#B76E00', backgroundColor: '#FFF5CC'};
    else if (status === "In Progress") return {backgroundColor: '#CAFDF5', color: '#006C9C'};
    else if (status === "Completed") return { backgroundColor: 'rgba(34, 197, 94, 0.16)', color: 'rgb(17, 141, 87)'};
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID" },
    { field: "title", headerName: "Title" },
    { field: "client_id", headerName: "Customer", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value}
          sx={{
            backgroundColor: statusToColor(params.value)?.backgroundColor,
            color: statusToColor(params.value)?.color,
          }}
        />
      ),
    },
    {
      field: "priority",
      headerName: "Priority",
      width: 130,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value ?? "None"}
          sx={{
            backgroundColor: priorityColor(params.value)?.backgroundColor,
            color: priorityColor(params.value)?.color,
          }}
        />
      ),
    },
    { field: "assigned_to", headerName: "Assignee", width: 150 },
    {
      field: "created_at",
      headerName: "Created At",
      width: 130,
      valueGetter: (params: any) => {
        return new Date(params).toLocaleDateString()
      }
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params: GridRenderCellParams<any>) => (
        <>
          <IconButton
            onClick={(e) => handleMenuOpen(params.row.id as string, e)}
          >
            <MoreVert />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={isMenuOpen && menuRequestId === params.row.id}
            onClose={handleMenuClose}
          >
            <MenuItem
              onClick={() => {
                handleMenuClose();
                router.push(`/agent/requests/${params.row.id}`);
              }}
            >
              View
            </MenuItem>
          </Menu>
        </>
      ),
    },
  ];

  const filteredRequests = requests?.filter(
    (request) =>
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const rows = filteredRequests?.map((request) => ({
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
      <Paper
        sx={{
          boxShadow:
            "rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px",
          borderRadius: "16px",
        }}
      >
        <TextField
          variant="outlined"
          margin="normal"
          placeholder="Search requests"
          value={searchTerm}
          onChange={handleSearchChange}
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
              getRowHeight={() => 'auto'}
              
              rowSpacingType="border"
              sx={{
                border: 'none', // Removes the outer border
                '& .MuiDataGrid-row--borderBottom .MuiDataGrid-columnHeader': {
                  border: 'none'
                },
                '& .MuiDataGrid-columnHeader': {
                  backgroundColor: '#F4F6F8',
                },
                '& .MuiDataGrid-cell': {
                   border: 'none',
                  padding: '16px'
                },
                '& .MuiDataGrid-row': {
                  borderBottomColor: 'rgb(145 158 171 / 20%)',
                  borderBottomStyle: 'dashed',
                  borderBottomWidth: '1px',
                  borderBottomSpacing: '2px',
                },
                '& .MuiDataGrid-filler > *': {
                  border: 'none'
                }
              }}
            />
          </Box>
        )}
      </Paper>
    </>
  );
};
