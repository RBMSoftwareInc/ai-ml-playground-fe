import React from 'react';
import { Box, Typography, Button } from '@mui/material';

interface FragmentSelectorProps {
  sectionId: string;
  slotId: string;
  onClose: () => void;
  onSelect: (sectionId: string, slotId: string, fragment: any) => void;
  fragments: Fragment[];
}

interface Fragment {
  id: string;
  name: string;
  type: 'Fragment';
  content: any;
  config: any;
  category: string;
}

const FragmentSelector: React.FC<FragmentSelectorProps> = ({ sectionId, slotId, onClose, onSelect, fragments }) => {
  const handleSelect = (fragment: Fragment) => {
    onSelect(sectionId, slotId, { type: 'Fragment', id: fragment.id, title: fragment.name, content: fragment.content, config: fragment.config });
  };

  return (
    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'white', p: 2, borderRadius: 1 }}>
      <Typography>Select Fragment for Slot {slotId} in Section {sectionId}</Typography>
      {fragments.map((fragment) => (
        <Button key={fragment.id} onClick={() => handleSelect(fragment)} sx={{ display: 'block', mb: 1 }}>
          {fragment.name}
        </Button>
      ))}
      <Button onClick={onClose}>Close</Button>
    </Box>
  );
};

export default FragmentSelector;