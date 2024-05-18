import React from 'react';
import { AppBar, Toolbar, Typography, useTheme } from '@mui/material';

function Navbar() {
  const theme = useTheme();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            fontFamily: theme.typography.logo.fontFamily,
            fontWeight: theme.typography.logo.fontWeight,
            fontSize: theme.typography.logo.fontSize,
            letterSpacing: theme.typography.logo.letterSpacing,
            color: theme.typography.logo.color,
          }}
        >
          NFT Project
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
