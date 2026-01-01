import * as React from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Chip,
  CircularProgress,
  Typography,
} from "@mui/material";
import { getAllUsers } from "../services/user-service";

/* =======================
   TABLE CONFIG
======================= */
const columns = [
  { id: "fullname", label: "Full Name", minWidth: 180 },
  { id: "email", label: "Email", minWidth: 220 },
  { id: "role", label: "Role", minWidth: 120 },
  { id: "gender", label: "Gender", minWidth: 120 },
  { id: "phone_number", label: "Phone", minWidth: 150 },
  { id: "authType", label: "Auth Type", minWidth: 160 },
  { id: "status", label: "Status", minWidth: 120 },
  { id: "actions", label: "Actions", minWidth: 120 },
];

export default function Users() {
  const [rows, setRows] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [loading, setLoading] = React.useState(false);

  const [openEdit, setOpenEdit] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState(null);

  /* =======================
     API
  ======================= */
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsers();
      setRows(res?.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id, payload) => {
    // TODO: Replace with PATCH API
    setRows((prev) =>
      prev.map((u) => (u._id === id ? { ...u, ...payload } : u))
    );
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const getAuthType = (user) =>
    !user?.Password ? (
      <Chip label="Google" size="small" color="info" />
    ) : (
      <Chip label="Email/Password" size="small" />
    );

  /* =======================
     RENDER
  ======================= */
  return (
    <Box sx={{ minHeight: "100vh", p: 2 }}>
      <Paper
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6" sx={{ p: 2 }}>
          Users Management
        </Typography>

        <TableContainer sx={{ flex: 1 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell key={col.id} sx={{ fontWeight: 600 }}>
                    {col.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              )}

              {!loading && rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    No users found
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow hover key={row._id}>
                      {columns.map((col) => {
                        if (col.id === "actions") {
                          return (
                            <TableCell key={col.id}>
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => {
                                  setSelectedUser({ ...row });
                                  setOpenEdit(true);
                                }}
                              >
                                Edit
                              </Button>
                            </TableCell>
                          );
                        }

                        if (col.id === "authType") {
                          return (
                            <TableCell key={col.id}>
                              {getAuthType(row)}
                            </TableCell>
                          );
                        }

                        return (
                          <TableCell key={col.id}>
                            {row[col.id] ?? "-"}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          rowsPerPageOptions={[10, 25, 50]}
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(+e.target.value);
            setPage(0);
          }}
        />
      </Paper>

      {/* EDIT MODAL */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth>
        <DialogTitle>Edit User</DialogTitle>

        {selectedUser && (
          <DialogContent dividers>
            <Stack spacing={2}>
              {["fullname", "email", "phone_number", "role", "status"].map(
                (field) => (
                  <TextField
                    key={field}
                    label={field.replace("_", " ").toUpperCase()}
                    value={selectedUser[field] || ""}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        [field]: e.target.value,
                      })
                    }
                    fullWidth
                  />
                )
              )}
            </Stack>
          </DialogContent>
        )}

        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={async () => {
              await updateUser(selectedUser._id, selectedUser);
              setOpenEdit(false);
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
