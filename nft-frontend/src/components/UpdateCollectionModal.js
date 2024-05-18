import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, CircularProgress } from '@mui/material';
import useUpdateCollectionMetadata from '../hooks/useUpdateCollectionMetadata';
import { useSnackbar } from 'notistack';

const UpdateCollectionModal = ({ isOpen, onClose }) => {
  const { updateMetadata, updating, error } = useUpdateCollectionMetadata();
  const [newName, setNewName] = useState('');
  const [newSymbol, setNewSymbol] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const success = await updateMetadata(newName.trim(), newSymbol.trim());
    if (success) {
      enqueueSnackbar('Collection metadata updated successfully!', { variant: 'success' });
      onClose();
    } else {
      enqueueSnackbar(error || 'Failed to update collection metadata.', { variant: 'error' });
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="update-collection-modal-title"
      aria-describedby="update-collection-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography id="update-collection-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
          Update Collection Metadata
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="New Collection Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value.trim())}
            fullWidth
            margin="normal"
            required
            variant="filled"
            InputProps={{
              sx: {
                backgroundColor: '#ffffff',
                color: '#000',
                padding: '12px 14px',
                '&:hover': {
                  backgroundColor: '#ffffff'
                },
                '&.Mui-focused': {
                  backgroundColor: '#ffffff'
                }
              }
            }}
            InputLabelProps={{
              sx: { color: '#000' }
            }}
          />
          <TextField
            label="New Collection Symbol"
            value={newSymbol}
            onChange={(e) => setNewSymbol(e.target.value.trim())}
            fullWidth
            margin="normal"
            required
            variant="filled"
            InputProps={{
              sx: {
                backgroundColor: '#ffffff',
                color: '#000',
                padding: '12px 14px',
                '&:hover': {
                  backgroundColor: '#ffffff'
                },
                '&.Mui-focused': {
                  backgroundColor: '#ffffff'
                }
              }
            }}
            InputLabelProps={{
              sx: { color: '#000' }
            }}
          />
          <Button type="submit" variant="contained" color="secondary" fullWidth disabled={updating} sx={{ mt: 2 }}>
            {updating ? <CircularProgress size={24} /> : 'Update'}
          </Button>
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: '12px',
};

export default UpdateCollectionModal;
