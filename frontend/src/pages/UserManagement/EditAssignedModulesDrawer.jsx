import React, { useState, useEffect, useCallback } from 'react';
import {
  Drawer,
  Button,
  Box,
  Typography,
  Divider,
  Grid,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Snackbar,
  Alert,
  useTheme
} from '@mui/material';
import axios from 'axios';
import ErrorBoundary from '../../components/ErrorBoundary';
import ErrorNotification from '../../components/ErrorNotification';
import useErrorHandler from '../../hooks/useErrorHandler';

const EditAssignedModulesDrawer = ({ open, onClose, user, onModulesUpdated }) => {
  const theme = useTheme();
  const { error, handleError, clearError } = useErrorHandler();
  const [modules, setModules] = useState([]);
  const [selectedModules, setSelectedModules] = useState([]);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const fetchModules = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        handleError(new Error('Authentication token not found'));
        return;
      }

      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/modules`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setModules(response.data);
    } catch (error) {
      handleError(new Error('Failed to fetch modules. Please try again.'));
    }
  }, [handleError]);

  useEffect(() => {
    if (open && user) {
      fetchModules();
      setSelectedModules(user.assignedModules || []);
    }
  }, [open, user, fetchModules]);

  const handleModuleChange = (moduleId) => {
    setSelectedModules(prev => {
      if (prev.includes(moduleId)) {
        return prev.filter(id => id !== moduleId);
      } else {
        return [...prev, moduleId];
      }
    });
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        handleError(new Error('Authentication token not found'));
        return;
      }

      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/users/${user._id}/modules`,
        { assignedModules: selectedModules },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setNotificationOpen(true);
      onModulesUpdated();
      onClose();
    } catch (error) {
      handleError(new Error('Failed to update assigned modules. Please try again.'));
    }
  };

  const handleNotificationClose = () => {
    setNotificationOpen(false);
  };

  return (
    <ErrorBoundary>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: '600px' },
            backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff',
            color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
          },
        }}
      >
        <Box sx={{ padding: 4 }}>
          <Typography variant="h5" gutterBottom>
            Edit Assigned Modules
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormGroup>
                {modules.map((module) => (
                  <FormControlLabel
                    key={module._id}
                    control={
                      <Checkbox
                        checked={selectedModules.includes(module._id)}
                        onChange={() => handleModuleChange(module._id)}
                        sx={{
                          color: theme.palette.mode === 'dark' ? '#f15a22' : '#f15a22',
                          '&.Mui-checked': {
                            color: theme.palette.mode === 'dark' ? '#f15a22' : '#f15a22',
                          },
                        }}
                      />
                    }
                    label={module.name}
                    sx={{
                      color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
                    }}
                  />
                ))}
              </FormGroup>
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
            <Button onClick={onClose} sx={{ mr: 2 }}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleSaveChanges}
              sx={{ backgroundColor: '#f15a22', '&:hover': { backgroundColor: '#d3541e' } }}
            >
              Save Changes
            </Button>
          </Box>

          <Snackbar
            open={notificationOpen}
            autoHideDuration={3000}
            onClose={handleNotificationClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert onClose={handleNotificationClose} severity="success" sx={{ width: '100%' }}>
              Assigned modules updated successfully!
            </Alert>
          </Snackbar>
        </Box>
        <ErrorNotification error={error} onClose={clearError} />
      </Drawer>
    </ErrorBoundary>
  );
};

export default EditAssignedModulesDrawer;
