import React, { useState } from 'react';
import { Container, Grid, CssBaseline, CircularProgress, Typography, Box, Button } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import CardComponent from './components/CardComponent';
import ModalComponent from './components/ModalComponent';
import Navbar from './components/Navbar';
import useFetchNFTData from './hooks/useFetchNFTData';
import useFetchCollectionMetadata from './hooks/useFetchCollectionMetadata';
import UpdateCollectionModal from './components/UpdateCollectionModal';
import MintNFTModal from './components/MintNFTModal';
import { useTheme } from '@mui/material/styles';

function App() {
  const theme = useTheme();
  const { cardData, loading } = useFetchNFTData();
  const { collectionName, collectionSymbol, loadingMetadata } = useFetchCollectionMetadata();
  const [selectedCard, setSelectedCard] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isMintModalOpen, setIsMintModalOpen] = useState(false);

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  const handleCloseModal = () => {
    setSelectedCard(null);
  };

  const handleOpenUpdateModal = () => {
    setIsUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
  };

  const handleOpenMintModal = () => {
    setIsMintModalOpen(true);
  };

  const handleCloseMintModal = () => {
    setIsMintModalOpen(false);
  };

  const buttonStyles = {
    mt: 2,
    mr: 2,
    bgcolor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    '&:hover': {
      bgcolor: theme.palette.secondary.dark,
    },
    borderRadius: '8px',
    boxShadow: '0 3px 5px 2px rgba(0, 0, 0, 0.5)', // Ajustare culoare shadow
    fontWeight: 'bold',
  };

  return (
    <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
      <div style={{ backgroundColor: theme.palette.background.default, minHeight: '100vh', color: theme.palette.text.primary }}>
        <CssBaseline />
        <Navbar />
        <Container style={{ paddingTop: '50px', paddingBottom: '50px' }}>
          <Box textAlign="center" mb={5}>
            <Typography variant="h3" component="h1" gutterBottom>
              {loadingMetadata ? 'Loading Collection...' : collectionName}
            </Typography>
            <Typography variant="h6" component="h2" sx={{ color: theme.palette.secondary.main }}>
              {loadingMetadata ? '' : `Symbol: ${collectionSymbol}`}
            </Typography>
            <Button variant="contained" sx={buttonStyles} onClick={handleOpenUpdateModal}>
              Update Collection Metadata
            </Button>
            <Button variant="contained" sx={{ ...buttonStyles, mt: 2, mr: 0 }} onClick={handleOpenMintModal}>
              Mint NFT
            </Button>
          </Box>
          <UpdateCollectionModal isOpen={isUpdateModalOpen} onClose={handleCloseUpdateModal} />
          <MintNFTModal isOpen={isMintModalOpen} onClose={handleCloseMintModal} />
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
              <CircularProgress style={{ color: theme.palette.primary.main }} />
            </div>
          ) : (
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
          )}
          {selectedCard && (
            <ModalComponent
              isOpen={Boolean(selectedCard)}
              onRequestClose={handleCloseModal}
              image={selectedCard.image}
              title={selectedCard.title}
              details={selectedCard.details}
              owner={selectedCard.owner}
              id={selectedCard.id}
            />
          )}
          <Box sx={{ height: '50px' }} /> {/* Space at the bottom */}
        </Container>
      </div>
    </SnackbarProvider>
  );
}

export default App;
