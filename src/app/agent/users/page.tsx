'use client'

import { useEffect, useState } from "react";
import { useGetAllUsers } from "@/src/hooks/useUsers"; // Assuming you have a hook to get users
import Link from "next/link";
import {
  Box,
  Button,
  Container,
  Grid,
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
  Paper,
  Breadcrumbs,
  Link as MuiLink,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SearchIcon from "@mui/icons-material/Search";
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useRouter } from "next/navigation";
import { User } from "@/src/types";


const Users = () => {
  const router = useRouter();
  const { data: users, isLoading } = useGetAllUsers();
  const [showUsers, setShowUsers] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<keyof User>("fullname");

  useEffect(() => {
    if (!isLoading && users) {
      setShowUsers(true);
    }
  }, [isLoading, users]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (property: keyof User) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const filteredUsers = users?.filter(
    (user) =>
      user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedUsers = filteredUsers?.sort((a, b) => {
    if (!a[orderBy] || !b[orderBy]) return 0; // Handle cases where the value is undefined
  
    if (orderBy === "created_at") {
      const aDate = a![orderBy]!.toDate();
      const bDate = b[orderBy]!.toDate();
      
      if (aDate && bDate) {
        return aDate < bDate ? -1 : 1;
      } else {
        return 0;
      }
    }
  
    return a[orderBy]! < b[orderBy]! ? -1 : 1;
  });

  const sortedAndPaginatedUsers = sortedUsers?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Container component="main" maxWidth="xl" sx={{ mt: 4 }}>
      <Grid container spacing={2} mb={2} justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography component="h1" variant="h5">
            Users
          </Typography>
        </Grid>
        <Grid item>
          <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />}>
            <MuiLink
              color="inherit"
              href="/"
              onClick={(e) => {
                e.preventDefault();
                router.push('/agent/dashboard');
              }}
              noWrap
            >
              <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              Dashboard
            </MuiLink>
            <Typography color="textPrimary" noWrap>Users</Typography>
          </Breadcrumbs>
        </Grid>
      </Grid>
      <Paper elevation={0} sx={{ borderRadius: 2, px: 2, py: 1 }}>
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          placeholder="Search users"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer sx={{ mt: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sortDirection={orderBy === "fullname" ? order : false}>
                      <TableSortLabel
                        active={orderBy === "fullname"}
                        direction={orderBy === "fullname" ? order : "asc"}
                        onClick={() => handleRequestSort("fullname")}
                      >
                        Full Name
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sortDirection={orderBy === "email" ? order : false}>
                      <TableSortLabel
                        active={orderBy === "email"}
                        direction={orderBy === "email" ? order : "asc"}
                        onClick={() => handleRequestSort("email")}
                      >
                        Email
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sortDirection={orderBy === "phone_number" ? order : false}>
                      <TableSortLabel
                        active={orderBy === "phone_number"}
                        direction={orderBy === "phone_number" ? order : "asc"}
                        onClick={() => handleRequestSort("phone_number")}
                      >
                        Phone
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sortDirection={orderBy === "created_at" ? order : false}>
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
                  {sortedAndPaginatedUsers?.map((user) => (
                    <Grow
                      in={showUsers}
                      style={{ transformOrigin: "0 0 0" }}
                      {...(showUsers ? { timeout: 1000 } : {})}
                      key={user.id}
                    >
                      <TableRow>
                        <TableCell>{user.fullname}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone_number}</TableCell>
                        <TableCell>{user.created_at?.toDate().toLocaleString()}</TableCell>
                        <TableCell>
                          <Button variant="outlined" component={Link} href={`/agent/users/${user.id}`}>
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    </Grow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredUsers?.length || 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Paper>
    </Container>
  );
}

export default Users;
