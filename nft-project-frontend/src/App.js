import React, { useState } from 'react';
import { Container, Grid, CssBaseline, CircularProgress } from '@mui/material';
import CardComponent from './components/CardComponent';
import ModalComponent from './components/ModalComponent';
import Navbar from './components/Navbar';
import useFetchNFTData from './hooks/useFetchNFTData';
import { useTheme } from '@mui/material/styles';

function App() {
  const theme = useTheme();
  const { cardData, loading } = useFetchNFTData();
  const [selectedCard, setSelectedCard] = useState(null);

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  const handleCloseModal = () => {
    setSelectedCard(null);
  };

  return (
    <div style={{ backgroundColor: theme.palette.background.default, minHeight: '100vh', color: theme.palette.text.primary }}>
      <CssBaseline />
      <Navbar />
      <Container style={{ paddingTop: '50px' }}>
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
            <CircularProgress style={{ color: 'white' }}/>
          </div>
        )}
        <Grid container spacing={3}>
          {cardData.map((card) => (
            <Grid item xs={12} sm={6} md={4} key={card.id}>
              <CardComponent
                image={card.image}
                title={card.title}
                onClick={() => handleCardClick(card)}
              />
            </Grid>
          ))}
        </Grid>
        {selectedCard && (
          <ModalComponent
            isOpen={Boolean(selectedCard)}
            onRequestClose={handleCloseModal}
            image={selectedCard.image}
            title={selectedCard.title}
            details={selectedCard.details}
          />
        )}
      </Container>
    </div>
  );
}

export default App;
