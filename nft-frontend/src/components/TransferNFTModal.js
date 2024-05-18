import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, CircularProgress } from '@mui/material';
import useTransferNFT from '../hooks/useTransferNFT';
import { useSnackbar } from 'notistack';

const TransferNFTModal = ({ isOpen, onClose }) => {
  const { transferNFT, transferring, error } = useTransferNFT();
  const [toAddress, setToAddress] = useState('');
  const [tokenId, setTokenId] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const success = await transferNFT(toAddress.trim(), tokenId.trim());
    if (success) {
      enqueueSnackbar('NFT transferred successfully!', { variant: 'success' });
      onClose();
    } else {
      enqueueSnackbar(error || 'Failed to transfer NFT.', { variant: 'error' });
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="transfer-nft-modal-title"
      aria-describedby="transfer-nft-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography id="transfer-nft-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
          Transfer NFT
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Recipient Address"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value.trim())}
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
            label="Token ID"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value.trim())}
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
          <Button type="submit" variant="contained" color="secondary" fullWidth disabled={transferring} sx={{ mt: 2 }}>
            {transferring ? <CircularProgress size={24} /> : 'Transfer'}
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

export default TransferNFTModal;
