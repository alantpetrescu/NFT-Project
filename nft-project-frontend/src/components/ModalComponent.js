import React from 'react';
import { Modal, Box, Typography, useTheme } from '@mui/material';

function ModalComponent({ isOpen, onRequestClose, image, title, details }) {
  const theme = useTheme();
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: theme.palette.background.paper,
    border: `2px solid ${theme.palette.primary.main}`,
    boxShadow: 24,
    p: 4,
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
      </Box>
    </Modal>
  );
}

export default ModalComponent;
