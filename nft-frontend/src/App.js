import React, { useState } from 'react';
import { Container, Grid, CssBaseline, CircularProgress, Button, Box, Typography } from '@mui/material'; // Adăugăm Typography aici
import CardComponent from './components/CardComponent';
import ModalComponent from './components/ModalComponent';
import Navbar from './components/Navbar';
import MintNFTModal from './components/MintNFTModal';
import TransferNFTModal from './components/TransferNFTModal';
import UpdateCollectionModal from './components/UpdateCollectionModal';
import useFetchNFTData from './hooks/useFetchNFTData';
import useFetchCollectionMetadata from './hooks/useFetchCollectionMetadata';
import { useTheme } from '@mui/material/styles';
import { SnackbarProvider } from 'notistack';

function App() {
  const theme = useTheme();
  const { cardData, loading } = useFetchNFTData();
  const { metadata, loading: loadingMetadata } = useFetchCollectionMetadata(); // Eliminăm metadataError
  const [selectedCard, setSelectedCard] = useState(null);
  const [mintModalOpen, setMintModalOpen] = useState(false);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  const handleCloseModal = () => {
    setSelectedCard(null);
  };

  return (
    <SnackbarProvider maxSnack={3}>
      <div style={{ backgroundColor: theme.palette.background.default, minHeight: '100vh', color: theme.palette.text.primary }}>
        <CssBaseline />
        <Navbar />
        <Container style={{ paddingTop: '50px' }}>
          {loadingMetadata ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
              <CircularProgress style={{ color: 'white' }} />
            </div>
          ) : (
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Typography variant="h4">{metadata.name}</Typography>
              <Typography variant="h6" sx={{ color: theme.palette.secondary.main }}>{metadata.symbol}</Typography>
              <Button variant="outlined" color="secondary" onClick={() => setUpdateModalOpen(true)} sx={{ mt: 2 }}>
                Update Collection Metadata
              </Button>
            </Box>
          )}
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
              <CircularProgress style={{ color: 'white' }} />
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
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <Button variant="outlined" color="secondary" onClick={() => setMintModalOpen(true)} sx={{ mt: 2, mr: 2 }}>
              Mint NFT
            </Button>
            <Button variant="outlined" color="secondary" onClick={() => setTransferModalOpen(true)} sx={{ mt: 2 }}>
              Transfer NFT
            </Button>
          </Box>
        </Container>
        <MintNFTModal isOpen={mintModalOpen} onClose={() => setMintModalOpen(false)} />
        <TransferNFTModal isOpen={transferModalOpen} onClose={() => setTransferModalOpen(false)} />
        <UpdateCollectionModal isOpen={updateModalOpen} onClose={() => setUpdateModalOpen(false)} />
      </div>
    </SnackbarProvider>
  );
}

export default App;
