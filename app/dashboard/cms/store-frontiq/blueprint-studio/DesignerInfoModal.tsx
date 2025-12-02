import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Modal, styled } from '@mui/material';

interface DesignerInfoModalProps {
  showDesignerModal: boolean;
  setShowDesignerModal: (show: boolean) => void;
  handleDesignerInfoSubmit: (info: DesignerInfo) => void;
}

interface DesignerInfo {
  name: string;
  email: string;
  designName: string;
  description: string;
}

const ModalContent = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  backgroundColor: '#FFFFFF',
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  padding: theme.spacing(4),
}));

const DesignerInfoModal: React.FC<DesignerInfoModalProps> = ({
  showDesignerModal,
  setShowDesignerModal,
  handleDesignerInfoSubmit,
}) => {
  const [info, setInfo] = useState<DesignerInfo>({ name: '', email: '', designName: '', description: '' });

  const handleSubmit = () => {
    handleDesignerInfoSubmit(info);
  };

  return (
    <Modal open={showDesignerModal} onClose={() => setShowDesignerModal(false)}>
      <ModalContent>
        <Typography variant="h6">Designer Information</Typography>
        <TextField
          label="Name"
          value={info.name}
          onChange={(e) => setInfo({ ...info, name: e.target.value })}
          fullWidth
          size="small"
          sx={{ mb: 2 }}
        />
        <TextField
          label="Email"
          value={info.email}
          onChange={(e) => setInfo({ ...info, email: e.target.value })}
          fullWidth
          size="small"
          sx={{ mb: 2 }}
        />
        <TextField
          label="Design Name"
          value={info.designName}
          onChange={(e) => setInfo({ ...info, designName: e.target.value })}
          fullWidth
          size="small"
          sx={{ mb: 2 }}
        />
        <TextField
          label="Description"
          value={info.description}
          onChange={(e) => setInfo({ ...info, description: e.target.value })}
          fullWidth
          size="small"
          multiline
          rows={3}
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button variant="outlined" onClick={() => setShowDesignerModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>Submit</Button>
        </Box>
      </ModalContent>
    </Modal>
  );
};

export default DesignerInfoModal;