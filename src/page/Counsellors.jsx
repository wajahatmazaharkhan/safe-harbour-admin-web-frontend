import React, { useState, useEffect } from 'react';
import { 
  Box, Button, Paper, Typography, IconButton, Dialog, 
  DialogTitle, DialogContent, DialogActions, TextField, 
  Stack, Tooltip, InputAdornment 
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Refresh as RefreshIcon 
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';

import { counsellorService } from '../services/counsellor-service';
import { globalAsyncHandler } from '../utils/async-handler';

const initialFormState = {
  name: '',
  email: '',
  phone: '',
  specialization: '',
  years_experience: '',
  hourly_rate: ''
};

const Counsellors = () => {
  const [counsellors, setCounsellors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [selectedId, setSelectedId] = useState(null);

  // --- Fetch Data ---
  const fetchCounsellors = async () => {
    await globalAsyncHandler(
      () => counsellorService.getAll(),
      {
        setLoading: setLoading,
        onSuccess: (response) => {
           // Handle case where API returns array directly or { data: [] }
           const data = Array.isArray(response) ? response : response?.data || [];
           setCounsellors(data);
        }
      }
    );
  };

  useEffect(() => {
    fetchCounsellors();
  }, []);

  // --- UI Handlers ---
  const handleOpenDialog = (counsellor = null) => {
    if (counsellor) {
      setIsEditMode(true);
      setFormData(counsellor);
      setSelectedId(counsellor._id || counsellor.id);
    } else {
      setIsEditMode(false);
      setFormData(initialFormState);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData(initialFormState);
    setSelectedId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- Validation ---
  const validateForm = () => {
    if (!formData.name?.trim()) {
      toast.error("Full Name is required");
      return false;
    }
    if (!formData.email?.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (formData.years_experience < 0) {
      toast.error("Experience cannot be negative");
      return false;
    }
    return true;
  };

  // --- Submit ---
  const handleSubmit = async () => {
    if (!validateForm()) return;

    const apiCall = isEditMode 
      ? () => counsellorService.update(selectedId, formData)
      : () => counsellorService.create(formData);

    await globalAsyncHandler(apiCall, {
      setLoading: setSubmitting,
      successMessage: `Counsellor ${isEditMode ? 'updated' : 'created'} successfully`,
      onSuccess: () => {
        handleCloseDialog();
        fetchCounsellors();
      }
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this counsellor?")) return;

    await globalAsyncHandler(
      () => counsellorService.delete(id),
      {
        setLoading,
        successMessage: "Counsellor deleted successfully",
        onSuccess: () => fetchCounsellors()
      }
    );
  };

  // --- DataGrid Columns ---
  const columns = [
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 150 },
    { field: 'email', headerName: 'Email', flex: 1, minWidth: 200 },
    { field: 'phone', headerName: 'Phone', width: 130 },
    { field: 'specialization', headerName: 'Specialization', width: 150 },
    { 
      field: 'years_experience', 
      headerName: 'Exp (Yrs)', 
      width: 100, 
      type: 'number', 
      align: 'center',
      headerAlign: 'center'
    },
    { 
      field: 'hourly_rate', 
      headerName: 'Rate (₹)', 
      width: 100, 
      type: 'number',
      valueFormatter: (params) => params.value ? `₹${params.value}` : ''
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="Edit">
            <IconButton color="primary" size="small" onClick={() => handleOpenDialog(params.row)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton color="error" size="small" onClick={() => handleDelete(params.row._id || params.row.id)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ height: '100%', width: '100%', p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Counsellor Management
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchCounsellors}>
            Refresh
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
            Add Counsellor
          </Button>
        </Stack>
      </Stack>

      <Paper elevation={2} sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={counsellors}
          columns={columns}
          getRowId={(row) => row._id || row.id}
          loading={loading}
          pageSizeOptions={[10, 25, 50]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          disableRowSelectionOnClick
          sx={{ border: 0 }}
        />
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditMode ? 'Edit Counsellor' : 'Add New Counsellor'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              required
              error={!formData.name && submitting}
            />
            <TextField
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              required
            />
            
            <Stack direction="row" spacing={2}>
               <TextField
                 label="Phone Number"
                 name="phone"
                 value={formData.phone}
                 onChange={handleInputChange}
                 fullWidth
               />
               <TextField
                 label="Specialization"
                 name="specialization"
                 value={formData.specialization}
                 onChange={handleInputChange}
                 fullWidth
               />
            </Stack>

            <Stack direction="row" spacing={2}>
               <TextField
                 label="Years of Experience"
                 name="years_experience"
                 type="number"
                 value={formData.years_experience}
                 onChange={handleInputChange}
                 fullWidth
                 InputProps={{ inputProps: { min: 0 } }}
               />
               <TextField
                 label="Hourly Rate"
                 name="hourly_rate"
                 type="number"
                 value={formData.hourly_rate}
                 onChange={handleInputChange}
                 fullWidth
                 InputProps={{ 
                   startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                   inputProps: { min: 0 } 
                 }}
               />
            </Stack>

          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={submitting}>
            {submitting ? 'Saving...' : isEditMode ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Counsellors;