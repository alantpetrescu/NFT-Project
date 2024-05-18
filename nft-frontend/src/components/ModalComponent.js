import React from 'react';
import { Modal, Box, Typography, useTheme } from '@mui/material';

const ModalComponent = ({ isOpen, onRequestClose, image, title, details, owner, id }) => {
  const theme = useTheme();
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: theme.palette.background.default,
    border: `2px solid ${theme.palette.primary.main}`,
    boxShadow: 24,
    p: 4,
    borderRadius: '12px',
  };

  const ownerStyle = {
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    wordBreak: 'break-all',
  };

  return (
    <Modal
      open={isOpen}
      onClose={onRequestClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <img src={image} alt={title} style={{ width: '100%', marginBottom: '20px' }} />
        <Typography id="modal-title" variant="h6" component="h2">
          {title}
        </Typography>
        <Typography id="modal-description" sx={{ mt: 2 }}>
          {details}
        </Typography>
        <Typography sx={{ mt: 2 }}>
          <strong>Token ID:</strong> {id}
        </Typography>
        <Typography sx={{ mt: 2, ...ownerStyle }}>
          <strong>Owner:</strong> {owner}
        </Typography>
      </Box>
    </Modal>
  );
};

export default ModalComponent;
