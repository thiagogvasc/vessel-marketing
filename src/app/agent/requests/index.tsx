import { useEffect, useState } from "react";
import { useGetRequests } from "@/src/hooks/useRequests";
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
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SearchIcon from "@mui/icons-material/Search";

interface Request {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
}

const Requests = () => {
  const { data: requests, isLoading } = useGetRequests();
  const [showRequests, setShowRequests] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<keyof Request>("title");

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

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      request.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedRequests = filteredRequests?.sort((a, b) => {
    if (orderBy === "created_at" || orderBy === "updated_at") {
      return (new Date(a[orderBy]) as any) < (new Date(b[orderBy]) as any)
        ? -1
        : 1;
    }
    return a[orderBy] < b[orderBy] ? -1 : 1;
  });

  const sortedAndPaginatedRequests = sortedRequests?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Container component="main" maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Grid container spacing={2} justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography component="h1" variant="h4">
              Requests
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              component={Link}
              href="/requests/new"
            >
              New Request
            </Button>
          </Grid>
        </Grid>
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          placeholder="Search requests"
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
                    <TableCell sortDirection={orderBy === "title" ? order : false}>
                      <TableSortLabel
                        active={orderBy === "title"}
                        direction={orderBy === "title" ? order : "asc"}
                        onClick={() => handleRequestSort("title")}
                      >
                        Title
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sortDirection={orderBy === "description" ? order : false}>
                      <TableSortLabel
                        active={orderBy === "description"}
                        direction={orderBy === "description" ? order : "asc"}
                        onClick={() => handleRequestSort("description")}
                      >
                        Description
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sortDirection={orderBy === "status" ? order : false}>
                      <TableSortLabel
                        active={orderBy === "status"}
                        direction={orderBy === "status" ? order : "asc"}
                        onClick={() => handleRequestSort("status")}
                      >
                        Status
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sortDirection={orderBy === "priority" ? order : false}>
                      <TableSortLabel
                        active={orderBy === "priority"}
                        direction={orderBy === "priority" ? order : "asc"}
                        onClick={() => handleRequestSort("priority")}
                      >
                        Priority
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
                    <TableCell sortDirection={orderBy === "updated_at" ? order : false}>
                      <TableSortLabel
                        active={orderBy === "updated_at"}
                        direction={orderBy === "updated_at" ? order : "asc"}
                        onClick={() => handleRequestSort("updated_at")}
                      >
                        Updated At
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedAndPaginatedRequests?.map((request) => (
                    <Grow
                      in={showRequests}
                      style={{ transformOrigin: "0 0 0" }}
                      {...(showRequests ? { timeout: 1000 } : {})}
                      key={request.id}
                    >
                      <TableRow>
                        <TableCell>{request.title}</TableCell>
                        <TableCell>{request.description.substring(0, 50)}...</TableCell>
                        <TableCell>{request.status}</TableCell>
                        <TableCell>{request.priority}</TableCell>
                        <TableCell>{new Date(request.created_at).toLocaleString()}</TableCell>
                        <TableCell>{new Date(request.updated_at).toLocaleString()}</TableCell>
                        <TableCell>
                          <Button variant="outlined" component={Link} href={`/requests/${request.id}`}>
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
              count={filteredRequests?.length || 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Box>
    </Container>
  );
};

export default Requests;