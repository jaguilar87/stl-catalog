import React from 'react';
import {
  Table,
  TableHead,
  TableCell,
  TableContainer,
  TableBody,
  TableRow,
} from '@mui/material';

import { VendorItem } from './VendorItem';
import { useVendors } from '@/services/providers/VendorsProvider';
import { VendorService } from '@/services/VendorService';

export function VendorsList() {
  const { vendors } = useVendors();

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Vendor</TableCell>
            <TableCell>Folder</TableCell>
            <TableCell>Tags</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vendors.map((vendor: VendorService) => (
            <VendorItem key={vendor.rawFolderString} vendor={vendor} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
