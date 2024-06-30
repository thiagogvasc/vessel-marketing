'use client'

import { useEffect, useState } from "react";
import { useGetDatabasesByClientId } from "@/src/hooks/useDatabases";
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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Database } from "@/src/types"; // Assuming there's a Database type in your types file
import { useGetCurrentUser } from "@/src/hooks/useUsers";

const Databases = () => {
  const { data: user } = useGetCurrentUser();
  const { data: databases, isLoading } = useGetDatabasesByClientId(user?.id);
  const [showDatabases, setShowDatabases] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<keyof Database>("name");

  useEffect(() => {
    if (!isLoading && databases) {
      setShowDatabases(true);
    }
  }, [isLoading, databases]);

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

  const handleRequestSort = (property: keyof Database) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const filteredDatabases = databases?.filter(
    (database) =>
      database.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedDatabases = filteredDatabases?.sort((a, b) => {
    if (!a[orderBy] || !b[orderBy]) return 0; // Handle cases where the value is undefined

    return a[orderBy]! < b[orderBy]! ? -1 : 1;
  });

  const sortedAndPaginatedDatabases = sortedDatabases?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Container component="main" maxWidth="xl">
      <Paper elevation={0} sx={{ borderRadius: 2, p:4 , boxShadow: 'rgba(0, 0, 0, 0.04) 0px 5px 22px, rgba(0, 0, 0, 0.03) 0px 0px 0px 0.5px'}}>
      <Grid container spacing={2} mb={2} justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography component="h1" variant="h5">
            Projects
          </Typography>
        </Grid>
      </Grid>
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          placeholder="Search databases"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={ {
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                border: '1px solid rgb(239, 241, 245)', // Default border color
              },
              borderRadius: '10px',
            },
          }}
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
                    <TableCell sortDirection={orderBy === "name" ? order : false}>
                      <TableSortLabel
                        active={orderBy === "name"}
                        direction={orderBy === "name" ? order : "asc"}
                        onClick={() => handleRequestSort("name")}
                      >
                        Name
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedAndPaginatedDatabases?.map((database) => (
                    <Grow
                      in={showDatabases}
                      style={{ transformOrigin: "0 0 0" }}
                      {...(showDatabases ? { timeout: 1000 } : {})}
                      key={database.id}
                    >
                      <TableRow>
                        <TableCell>{database.name}</TableCell>
                        <TableCell>
                          <Button variant="outlined" component={Link} href={`/client/databases/${database.id}`}>
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
              count={filteredDatabases?.length || 0}
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

export default Databases;
