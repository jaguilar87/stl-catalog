import React from 'react';
import { TableRow, TableCell, Tooltip, IconButton } from '@mui/material';
import { HiFolderOpen, HiPhoto } from 'react-icons/hi2';
import { VendorService } from '@/services/VendorService';
import { useWs } from '@/services/providers/WSProvider';
import { COMMANDS } from '@/utils/constants';
import { useFilters } from '../../services/providers/FiltersProvider';
import { Tag } from './Tag';
import { useModal } from '@/services/providers/ModalsProvider';
import { Stack } from '@mui/system';

type PropTypes = {
  vendor: VendorService;
};

export function VendorItem({ vendor }: PropTypes) {
  const { socket } = useWs();
  const { showHiddenVendors } = useFilters();
  const handleOpenFolder = () =>
    socket?.emit(COMMANDS.EXPLORE, vendor.folderName);
  const { open } = useModal('gallery');

  if (!showHiddenVendors && vendor.hasTag('ZZZ')) {
    return null;
  }

  if (!vendor.name) {
    return null;
  }

  return (
    <TableRow>
      <TableCell>{vendor.label}</TableCell>
      <TableCell>{vendor.name}</TableCell>
      <TableCell>
        <Stack direction="row" gap={1}>
          {Array.from(vendor.tags).map((tag) => (
            <Tag key={tag} tag={tag} />
          ))}
        </Stack>
      </TableCell>
      <TableCell>
        <Tooltip title="Open gallery">
          <IconButton
            href="#"
            onClick={() => open({ path: vendor.rawFolderString })}
          >
            <HiPhoto />
          </IconButton>
        </Tooltip>
        <Tooltip title="Open folder">
          <IconButton href="#" onClick={handleOpenFolder}>
            <HiFolderOpen />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}
