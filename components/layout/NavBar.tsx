import React from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Typography,
  SvgIcon,
} from '@mui/material';
import {
  HiSwatch,
  HiArrowPath,
  HiFolderPlus,
  HiArrowsPointingIn,
} from 'react-icons/hi2';

import { ShowHiddenVendorsToggle } from './ShowHiddenVendorsToggle';
import { useModal } from '@/services/providers/ModalsProvider';
import { useVendors } from '@/services/providers/VendorsProvider';

export function NavBar() {
  const { open: openMerger } = useModal('merger');
  const { open: openParser } = useModal('parser');
  const { refresh } = useVendors();

  return (
    <>
      <AppBar position="fixed">
        <Toolbar variant="dense">
          <Box sx={{ flexGrow: 1 }}>
            <SvgIcon sx={{ mr: 2 }}>
              <HiSwatch />
            </SvgIcon>
            <Typography variant="h6" component="span">
              STL Catalog
            </Typography>
          </Box>
          <Box>
            <IconButton
              size="large"
              onClick={openMerger}
              color="inherit"
              title="Merge vendors"
            >
              <HiArrowsPointingIn />
            </IconButton>
            <IconButton
              size="large"
              onClick={openParser}
              color="inherit"
              title="Import new vendors"
            >
              <HiFolderPlus />
            </IconButton>
            <IconButton size="large" color="inherit">
              <ShowHiddenVendorsToggle />
            </IconButton>
            <IconButton
              size="large"
              onClick={refresh}
              color="inherit"
              title="Refresh"
            >
              <HiArrowPath />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
}
