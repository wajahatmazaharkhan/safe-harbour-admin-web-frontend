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
  CircularProgress,
  Typography,
} from "@mui/material";
import { getAllCounsellors } from "../services/counsellor-service";

/* =======================
   TABLE CONFIG
======================= */
const columns = [
  { id: "fullname", label: "Full Name", minWidth: 180 },
  { id: "email", label: "Email", minWidth: 220 },
  { id: "gender", label: "Gender", minWidth: 120 },
  {
    id: "years_experience",
    label: "Experience (yrs)",
    minWidth: 160,
    align: "right",
  },
  {
    id: "hourly_rate",
    label: "Rate (₹/hr)",
    minWidth: 160,
    align: "right",
  },
  { id: "status", label: "Status", minWidth: 120 },
  { id: "actions", label: "Actions", minWidth: 120 },
];

export default function Counsellors() {
  const [rows, setRows] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [loading, setLoading] = React.useState(false);

  const [openEdit, setOpenEdit] = React.useState(false);
  const [selected, setSelected] = React.useState(null);

  const fetchCounsellors = async () => {
    setLoading(true);
    try {
      const res = await getAllCounsellors();
      setRows(res?.data?.data || []);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCounsellors();
  }, []);

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
          Counsellors Management
        </Typography>

        <TableContainer sx={{ flex: 1 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((c) => (
                  <TableCell key={c.id} align={c.align}>
                    {c.label}
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

              {!loading &&
                rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow hover key={row._id}>
                      {columns.map((c) =>
                        c.id === "actions" ? (
                          <TableCell key={c.id}>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => {
                                setSelected({ ...row });
                                setOpenEdit(true);
                              }}
                            >
                              Edit
                            </Button>
                          </TableCell>
                        ) : (
                          <TableCell key={c.id} align={c.align}>
                            {row[c.id]}
                          </TableCell>
                        )
                      )}
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
          onPageChange={(_, p) => setPage(p)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(+e.target.value);
            setPage(0);
          }}
        />
      </Paper>

      {/* EDIT MODAL */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth>
        <DialogTitle>Edit Counsellor</DialogTitle>

        {selected && (
          <DialogContent dividers>
            <Stack spacing={2}>
              {[
                "fullname",
                "email",
                "hourly_rate",
                "years_experience",
                "status",
              ].map((f) => (
                <TextField
                  key={f}
                  label={f.replace("_", " ").toUpperCase()}
                  type={
                    f.includes("rate") || f.includes("experience")
                      ? "number"
                      : "text"
                  }
                  value={selected[f] || ""}
                  onChange={(e) =>
                    setSelected({ ...selected, [f]: e.target.value })
                  }
                  fullWidth
                />
              ))}
            </Stack>
          </DialogContent>
        )}

        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
