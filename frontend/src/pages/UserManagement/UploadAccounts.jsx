import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  useTheme,
  Alert,
  CircularProgress
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import ErrorBoundary from '../../components/ErrorBoundary';
import ErrorNotification from '../../components/ErrorNotification';
import useErrorHandler from '../../hooks/useErrorHandler';

const UploadAccounts = ({ open, onClose, onUsersAdded }) => {
  const theme = useTheme();
  const { error, handleError, clearError } = useErrorHandler();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false
  });

  const handleUpload = async () => {
    if (!file) return;

    try {
      setUploading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        handleError(new Error('Authentication token not found'));
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/users/upload`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setUploadSuccess(true);
      onUsersAdded();
      setTimeout(() => {
        onClose();
        setFile(null);
        setUploadSuccess(false);
      }, 2000);
    } catch (error) {
      handleError(new Error('Failed to upload accounts. Please check the file format and try again.'));
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setUploadSuccess(false);
    onClose();
  };

  return (
    <ErrorBoundary>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff',
            color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
          },
        }}
      >
        <DialogTitle>Upload User Accounts</DialogTitle>
        <DialogContent>
          <Box
            {...getRootProps()}
            sx={{
              border: '2px dashed',
              borderColor: isDragActive ? '#f15a22' : theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
              borderRadius: 2,
              p: 3,
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#f5f5f5',
              '&:hover': {
                backgroundColor: theme.palette.mode === 'dark' ? '#333333' : '#eeeeee',
              },
            }}
          >
            <input {...getInputProps()} />
            {file ? (
              <Typography>{file.name}</Typography>
            ) : (
              <Typography>
                {isDragActive
                  ? 'Drop the Excel file here'
                  : 'Drag and drop an Excel file here, or click to select'}
              </Typography>
            )}
          </Box>
          {uploadSuccess && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Accounts uploaded successfully!
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleUpload}
            disabled={!file || uploading}
            variant="contained"
            sx={{ backgroundColor: '#f15a22', '&:hover': { backgroundColor: '#d3541e' } }}
          >
            {uploading ? <CircularProgress size={24} color="inherit" /> : 'Upload'}
          </Button>
        </DialogActions>
        <ErrorNotification error={error} onClose={clearError} />
      </Dialog>
    </ErrorBoundary>
  );
};

export default UploadAccounts;
