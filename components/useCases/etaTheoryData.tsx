// app/eta/etaTheoryData.tsx
'use client'
import { Typography, Box, List, ListItem, ListItemText } from '@mui/material';
import Image from 'next/image';

const etaTheoryContent = (
  <Box>
    <Typography variant="h5" color="primary">📦 ETA Prediction – How It Works</Typography>
    <Typography mt={2}>
      Our ETA module uses a <strong>Linear Regression</strong> model trained on real-time logistics data.
      It factors in key elements like distance, carrier speed, city congestion, and weather.
    </Typography>

    <Typography variant="subtitle1" mt={4}>🔬 Core Formula</Typography>
    <pre style={{ background: '#f9f9f9', padding: '10px', borderRadius: 6 }}>
      ETA = (Distance / Speed) + Delay(weather) + City_Adjustment
    </pre>

    <Typography variant="subtitle1" mt={4}>📊 Dataset Highlights</Typography>
    <List dense>
      <ListItem><ListItemText primary="• 2,000+ historical shipments" /></ListItem>
      <ListItem><ListItemText primary="• Includes 15 cities across India" /></ListItem>
      <ListItem><ListItemText primary="• R² score: 0.91" /></ListItem>
    </List>

    <Typography variant="subtitle1" mt={4}>🧠 Influential Features</Typography>
    <List dense>
      <ListItem><ListItemText primary="• Carrier Speed: High correlation" /></ListItem>
      <ListItem><ListItemText primary="• Weather Conditions: Up to 20% delay" /></ListItem>
      <ListItem><ListItemText primary="• Origin-Destination Pairs: Real-time traffic offset" /></ListItem>
    </List>

    <Typography variant="subtitle1" mt={4}>🧩 Model Architecture</Typography>
    <Box my={2}>
      <Image
        src="/images/eta_model_architecture.png"
        alt="ETA Model Architecture"
        width={800}
        height={320}
        style={{ borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
      />
    </Box>

    <Typography mt={4}>
      💡 This approach enables real-time, accurate, and explainable delivery time predictions—
      empowering operations with foresight.
    </Typography>
  </Box>
);

export default etaTheoryContent;
