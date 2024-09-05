import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

const modalStyle = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '400px',
  backgroundColor: 'white',
  border: '2px solid #000',
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  padding: '16px',
  zIndex: 1000,
};

export default function ChatroomTitleModal({ open, onClose, children }) {
    return (
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="basic-modal-title"
        aria-describedby="basic-modal-description"
      >
        <Box sx={modalStyle}>
          {children}
        </Box>
      </Modal>
    );
  }