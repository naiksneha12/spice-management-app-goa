import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, List, ListItem, Button, Box } from '@mui/material';
import spicesImg from '../assets/spices.jpg';
import garamMasalaImg from '../assets/garam_masala.jpg';
import tandooriMixImg from '../assets/tandoori_mix.jpg';
import chaatMasalaImg from '../assets/chaat_masala.jpg';
import './SpiceMixDetails.css';

const imgMap: Record<string, string> = {
  'garam_masala.jpg': garamMasalaImg,
  'tandoori_mix.jpg': tandooriMixImg,
  'chaat_masala.jpg': chaatMasalaImg,
};

interface SpiceMix {
  id: number;
  name: string;
  ingredients: string[];
  img?: string;
}

const SpiceMixDetails: React.FC<{ id: number; onBack: () => void }> = ({ id, onBack }) => {
  const [details, setDetails] = useState<SpiceMix | null>(null);

  useEffect(() => {
    fetch('/data/spiceMixes.json')
      .then(res => res.json())
      .then((data: SpiceMix[]) => {
        const found = data.find(mix => mix.id === id);
        setDetails(found || null);
      });
  }, [id]);

  if (!details) return <div>Spice mix not found.</div>;
  const imgSrc = details.img ? imgMap[details.img] || spicesImg : spicesImg;
  return (
    <Box className="spice-details-bg">
      <Card className="spice-details-card">
        <div className="spice-details-img-frame">
          <img src={imgSrc} alt={details.name} className="spice-details-img" onError={e => (e.currentTarget.src = spicesImg)} />
          <div className="spice-details-img-gradient" />
        </div>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" className="spice-details-title">{details.name} <span className="spice-details-title-fancy">Details</span></Typography>
          </Box>
          <Typography variant="subtitle1" className="spice-details-subtitle">Ingredients:</Typography>
          <List className="spice-details-list">
            {details.ingredients.map((ing: string) => (
              <ListItem key={ing} className="spice-details-list-item">{ing}</ListItem>
            ))}
          </List>
          <Button variant="contained" onClick={onBack} className="spice-details-btn">
            Back to Inventory
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SpiceMixDetails;
