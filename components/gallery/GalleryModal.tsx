import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';

import { useModal } from '@/services/providers/ModalsProvider';
import { Gallery } from './Gallery';

export function GalleryModal() {
  const { isOpen, close, getState } = useModal('gallery');

  return (
    <Dialog open={isOpen()} onClose={close}>
      <DialogTitle>Gallery</DialogTitle>
      <DialogContent>
        <Gallery path={getState().path} />
      </DialogContent>
    </Dialog>
  );
}
