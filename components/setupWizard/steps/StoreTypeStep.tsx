'use client'

import { Box, Typography, Grid, Button } from '@mui/material'

const storeTypes = [
  { value: 'fashion', label: '🧪 Fashion & Apparel' },
  { value: 'furniture', label: '🏠 Furniture & Home' },
  { value: 'electronics', label: '🧱 Electronics & Gadgets' },
  { value: 'grocery', label: '🛒 Grocery & Essentials' },
  { value: 'beauty', label: '🧴 Beauty & Wellness' },
  { value: 'automotive', label: '🚗 Automotive & Bikes' },
  { value: 'books', label: '📚 Books & Stationery' },
  { value: 'pets', label: '🐾 Pet Supplies' },
  { value: 'sports', label: '🏋️ Sports & Outdoors' },
  { value: 'baby', label: '👶 Baby & Kids' },
  { value: 'pharmacy', label: '💊 Pharmacy & Health' },
  { value: 'appliances', label: '🏡 Home Appliances' },
  { value: 'jewelry', label: '💍 Jewelry & Accessories' },
  { value: 'gaming', label: '🎮 Gaming & Virtual Gear' },
  { value: 'digital', label: '💾 Digital Downloads' },
  { value: 'luxury', label: '👑 Luxury & Designer Goods' },
  { value: 'tools', label: '🛠️ Tools & Hardware' },
  { value: 'music', label: '🎷 Musical Instruments' },
  { value: 'craft', label: '🎨 Art & Craft Supplies' },
  { value: 'agriculture', label: '🌱 Agriculture & Seeds' },
  { value: 'industrial', label: '🏗️ Industrial & Machinery' },
  { value: 'diy', label: '🧰 DIY & Maker Kits' },
  { value: 'energy', label: '🔋 Renewable Energy Products' },
  { value: 'footwear', label: '👟 Footwear & Accessories' },
  { value: 'travel', label: '✈️ Travel Gear & Luggage' },
  { value: 'food', label: '🍱 Packaged Food & Beverages' }
]

export default function StoreTypeStep({ formData, onChange }: any) {
  return (
    <Box>
      <Typography variant="h6" mb={3} fontWeight="bold">🛍️ Select Store Type</Typography>

      <Grid container spacing={2}>
        {storeTypes.map((store) => (
          <Grid item xs={6} sm={4} md={3} key={store.value}>
            <Button
              fullWidth
              onClick={() => onChange('store_type', store.value)}
              sx={{
                borderRadius: '25px',
                background: formData.store_type === store.value ? '#b71c1c' : '#fff',
                color: formData.store_type === store.value ? '#fff' : '#000',
                fontWeight: 500,
                border: '2px solid #ff4d4d',
                boxShadow: formData.store_type === store.value
                  ? '0 0 10px #ff4d4d, 0 0 20px #ff4d4d, 0 0 30px #ff4d4d'
                  : '2px 2px 6px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 0 10px #ff4d4d, 0 0 20px #ff4d4d, 0 0 30px #ff4d4d',
                }
              }}              
            >
              {store.label}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
