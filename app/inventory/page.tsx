'use client';

import { useState } from 'react';
import GenericForm from '../../components/forms/GenericForm';
import GenericTheory from '../../components/forms/GenericTheory';
import DatasetViewer from '../../components/forms/DatasetViewer';
import InsightsPanel from '../../components/forms/InsightsPanel';
import CopilotPanel from '../../components/forms/AskGene';
import DemoPlayer from '../../components/forms/DemoPlayer';
import FormWrapper from '../../components/FormWrapper';
import { Paper, Typography } from '@mui/material';
import { postJson } from '../../lib/api';

const inventoryFields = [
  { name: 'sku', label: 'SKU', type: 'text' },
  { name: 'category', label: 'Category', type: 'select', options: ['Apparel', 'Footwear', 'Accessories', 'Home'] },
  { name: 'average_daily_sales', label: 'Average Daily Sales', type: 'number' },
  { name: 'inventory_on_hand', label: 'Inventory On Hand', type: 'number' },
  { name: 'lead_time_days', label: 'Supplier Lead Time (days)', type: 'number' },
  { name: 'safety_stock', label: 'Safety Stock', type: 'number' },
];

const inventoryTheory = `
Inventory reordering balances forecasted demand, MOQ, and supplier reliability.
The classic calculation: Reorder Point = (Average Daily Usage × Lead Time) + Safety Stock.
Use telemetry from PoS, marketplace, and warehouse feeds to keep the signal tight.
`;

function InventoryResult({ reorderQty }: { reorderQty: number | null }) {
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        backgroundColor: 'rgba(33,150,243,0.08)',
        border: '1px solid rgba(33,150,243,0.3)',
        minHeight: 140,
      }}
    >
      {reorderQty !== null ? (
        <>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#2196f3' }}>
            Reorder {reorderQty} units
          </Typography>
          <Typography variant="body2" sx={{ mt: 1.5, color: 'rgba(255,255,255,0.7)' }}>
            This keeps buffer stock healthy through the supplier lead time window.
          </Typography>
        </>
      ) : (
        <Typography color="text.secondary">Provide SKU velocity to calculate the reorder suggestion.</Typography>
      )}
    </Paper>
  );
}

export default function InventoryReorderPage() {
  const [loading, setLoading] = useState(false);
  const [reorderQuantity, setReorderQuantity] = useState<number | null>(null);

  const handleSubmit = async (payload: any) => {
    setLoading(true);
    try {
      const data = await postJson('/api/v1/inventory/reorder', payload);
      setReorderQuantity(data.reorder_quantity ?? null);
    } catch (error) {
      console.error('Inventory reorder failed', error);
      const fallback =
        (payload.average_daily_sales || 0) * (payload.lead_time_days || 0) + (payload.safety_stock || 0);
      setReorderQuantity(Math.max(0, Math.round(fallback)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormWrapper
      title="Inventory Reordering"
      subtitle="Calculate replenishment quantities by blending velocity, safety stock, and supplier SLAs."
      metaLabel="LOGISTICS OPS"
    >
      {{
        form: <GenericForm fields={inventoryFields} onSubmit={handleSubmit} loading={loading} />,
        result: <InventoryResult reorderQty={reorderQuantity} />,
        theory: <GenericTheory content={inventoryTheory} />,
        dataset: <DatasetViewer />,
        insights: <InsightsPanel />,
        ask: <CopilotPanel contextType="inventory" />,
        demo: <DemoPlayer />,
      }}
    </FormWrapper>
  );
}

