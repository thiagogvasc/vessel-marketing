"use client";
import "./RequestsContainer.css";
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
  Avatar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/navigation";
import { Request } from "@/src/types";
import { useTheme } from "@mui/material/styles";
import React from "react";
import {
  DataGrid,
  GridColDef,
  GridColumnHeaderParams,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import MoreVert from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useGetAllUsers } from "../../hooks/react-query/user";
import { CustomerCellContainer } from "./CustomerCellContainer";
import { CustomChip } from "../../components/CustomChip";
import { StyledPaper } from "../../components/StyledPaper";

export const RequestsContainer = () => {
  const router = useRouter();
  const { data: requests, isLoading } = useGetRequests();
  const { data: users } = useGetAllUsers();
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
    event: React.MouseEvent<HTMLElement>,
  ) => {
    setMenuRequestId(requestId);
    setAnchorEl(event.currentTarget);
  };

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
      request.description.toLowerCase().includes(searchTerm.toLowerCase()),
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
      <StyledPaper>
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
