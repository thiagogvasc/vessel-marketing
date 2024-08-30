"use client";

import { useEffect, useState } from "react";
import { useGetRequests } from "@/src/hooks/react-query/request";
import {
  Box,
  Typography,
  CircularProgress,
  Grow,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  TablePagination,
  InputAdornment,
  TableSortLabel,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/navigation";
import { Request } from "@/src/types";
import { MoreVert } from "@mui/icons-material";
import theme from "@/src/theme";
import { useTheme } from "@emotion/react";
import React from "react";


export const RequestsContainer = () => {
  const router = useRouter();
  const { data: requests, isLoading } = useGetRequests();
  const [showRequests, setShowRequests] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<keyof Request>("title");
  console.warn(requests);
  const t = useTheme();
  useEffect(() => {
    if (!isLoading && requests) {
      setShowRequests(true);
    }
  }, [isLoading, requests]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (property: keyof Request) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const filteredRequests = requests?.filter(
    (request) =>
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const sortedRequests = filteredRequests?.sort((a, b) => {
    if (!a[orderBy] || !b[orderBy]) return 0; // Handle cases where the value is undefined

    if (orderBy === "created_at" || orderBy === "updated_at") {
      const aDate = a[orderBy];
      const bDate = b[orderBy];

      if (aDate && bDate) {
        return aDate < bDate ? -1 : 1;
      } else {
        return 0;
      }
    }

    return a[orderBy]! < b[orderBy]! ? -1 : 1;
  });

  const sortedAndPaginatedRequests = sortedRequests?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuRequestId, setMenuRequestId] = useState<null | string>(null);
  const isMenuOpen = Boolean(anchorEl);

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

  const priorityColor = (priority: string) => {
    if (priority === 'Low') return '#95A5A6'
    else if (priority === 'Medium') return '#F39C12'
    else if (priority === 'High') return '#E74C3C'
  }

  const statusToColor = (status: string) => {
    if (status === 'Pending') return '#F1C40F'
    else if (status === 'In Progress') return '#3498DB'
    else if (status === 'Completed') return '#2ECC71'
  }

  return (
    <>
    
        <Typography component="h1" variant="h5">
          Requests
        </Typography>
        <Paper sx={{
            boxShadow: 'rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px',
            borderRadius: '16px'
          }}>
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
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ border: "none" }}>
                  <TableCell>
                     
                        ID
                     
                    </TableCell>
                    <TableCell
                      sortDirection={orderBy === "title" ? order : false}
                    >
                      <TableSortLabel
                        active={orderBy === "title"}
                        direction={orderBy === "title" ? order : "asc"}
                        onClick={() => handleRequestSort("title")}
                      >
                        Title
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      Customer
                    </TableCell>
                    <TableCell
                      sortDirection={orderBy === "status" ? order : false}
                    >
                      <TableSortLabel
                        active={orderBy === "status"}
                        direction={orderBy === "status" ? order : "asc"}
                        onClick={() => handleRequestSort("status")}
                      >
                        Status
                      </TableSortLabel>
                    </TableCell>
                    <TableCell
                      sortDirection={orderBy === "priority" ? order : false}
                    >
                      <TableSortLabel
                        active={orderBy === "priority"}
                        direction={orderBy === "priority" ? order : "asc"}
                        onClick={() => handleRequestSort("priority")}
                      >
                        Priority
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                     
                     Assignee
                  
                 </TableCell>
                    <TableCell
                      sortDirection={orderBy === "created_at" ? order : false}
                    >
                      <TableSortLabel
                        active={orderBy === "created_at"}
                        direction={orderBy === "created_at" ? order : "asc"}
                        onClick={() => handleRequestSort("created_at")}
                      >
                        Created At
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedAndPaginatedRequests?.map((request) => (
                    <React.Fragment key={request.id ?? ''}>
                      <TableRow>
                      <TableCell>{request.id}</TableCell>
                        <TableCell>{request.title}</TableCell>
                        <TableCell>{request.client_id}</TableCell>
                        <TableCell sx={{ color: theme.palette.text.secondary }}>
                          <Chip label={request.status} sx={{backgroundColor: statusToColor(request.status), color: theme.palette.getContrastText(statusToColor(request.status) ?? '')}}/>
                        </TableCell>
                        <TableCell sx={{ color: theme.palette.text.secondary }}>
                          {request.priority ? (
                            <Chip label={request.priority} sx={{backgroundColor: priorityColor(request.priority), color: theme.palette.getContrastText(priorityColor(request.priority)??'')}}/>
                          ) : (
                            <>None</>
                          )}
                        </TableCell>
                        <TableCell>
                          {request.assigned_to}
                        </TableCell>
                        <TableCell sx={{ color: theme.palette.text.secondary }}>
                          {new Date(request.created_at ?? '').toLocaleDateString()}
                        </TableCell>
                        <TableCell sx={{ color: theme.palette.text.secondary }}>
                          <IconButton
                            onClick={(e) =>
                              handleMenuOpen(request.id as string, e)
                            }
                          >
                            <MoreVert />
                          </IconButton>
                          <Menu
                            anchorEl={anchorEl}
                            open={isMenuOpen && menuRequestId === request.id}
                            onClose={handleMenuClose}
                          >
                            <MenuItem
                              onClick={() => {
                                handleMenuClose();
                                router.push(`/agent/requests/${request.id}`);
                              }}
                            >
                              View
                            </MenuItem>
                          </Menu>
                        </TableCell>
                      </TableRow>
                      </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredRequests?.length || 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
        </Paper>
    </>
  );
};
