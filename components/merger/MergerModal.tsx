import React, { useCallback, useMemo, useState } from 'react';
import ss from 'string-similarity';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import { HiFolderOpen } from 'react-icons/hi2';

import { useModal } from '@/services/providers/ModalsProvider';
import { useWs } from '@/services/providers/WSProvider';
import { useVendors } from '@/services/providers/VendorsProvider';
import { COMMANDS } from '@/utils/constants';
import { Tag } from '../vendors/Tag';
import { Gallery } from '../gallery/Gallery';

export function MergerModal() {
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, close } = useModal('merger');
  const { socket } = useWs();
  const { vendors, setVendors } = useVendors();

  const sussyVendors = useMemo(
    () =>
      vendors.filter(
        (vendor) => vendor.hasTag('NEW') || vendor.tags.size === 0
      ),
    [vendors]
  );
  const firstVendor = useMemo(() => sussyVendors.at(0), [sussyVendors]);
  const bestMatches = useMemo(() => {
    if (!firstVendor || !firstVendor.name) return [];

    return ss
      .findBestMatch(
        firstVendor.name!,
        vendors.map((vendor) => vendor.searchableName)
      )
      .ratings.map((match: any, index: number) => ({
        vendor: vendors[index],
        match,
      }))
      .sort((a: any, b: any) => b.match.rating - a.match.rating)
      .slice(0, 50)
      .filter(
        (match: any) =>
          match.vendor.rawFolderString !== firstVendor!.rawFolderString
      )
      .map((match: any) => match.vendor);
  }, [firstVendor, vendors]);

  const explore = useCallback(
    (name: string) => socket?.emit(COMMANDS.EXPLORE, name),
    [socket]
  );

  const nextVendor = useCallback(() => {
    document.querySelector<HTMLInputElement>('#newTags')!.value = '';
    document.querySelector<HTMLInputElement>('#mergeWithNoneRadio')!.checked =
      true;

    setVendors(
      vendors.filter(
        (vendor) => vendor.rawFolderString !== firstVendor!.rawFolderString
      )
    );
    setIsLoading(false);
  }, [firstVendor, setVendors, vendors]);

  const merge = useCallback(() => {
    setIsLoading(true);

    const mergeWith = document.querySelector<HTMLInputElement>(
      'input[name="mergeWith"]:checked'
    )?.value;
    const newTags = document.querySelector<HTMLInputElement>('#newTags')?.value;

    if (mergeWith === 'none' || !mergeWith) {
      console.log('tagging', firstVendor!.folderName, newTags);
      socket?.emit(COMMANDS.TAG, firstVendor!.folderName, newTags, nextVendor);

      return;
    }

    socket?.emit(
      COMMANDS.MERGE,
      firstVendor!.folderName,
      mergeWith,
      newTags,
      nextVendor
    );
  }, [firstVendor, nextVendor, socket]);

  React.useEffect(() => console.log(firstVendor), [firstVendor]);

  if (!isOpen()) return null;

  if (!firstVendor) {
    return (
      <Dialog open={isOpen()} onClose={close}>
        <DialogTitle>Merge Vendors</DialogTitle>
        <DialogContent>
          <p>There is no suspicious vendors. Nice!</p>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen()} onClose={close} fullWidth maxWidth="xl">
      <DialogTitle>Merge {sussyVendors.length} Vendors</DialogTitle>
      <DialogContent>
        <Grid container spacing={4}>
          <Grid item width={'50%'} height={'300px'}>
            <Gallery path={firstVendor!.rawFolderString} height="600px" />
          </Grid>
          <Grid item width={'50%'}>
            <Grid container spacing={2}>
              <Grid item>
                {firstVendor?.label || firstVendor?.rawFolderString}
              </Grid>
              {Array.from(firstVendor!.tags).map((tag) => (
                <Grid item key={tag}>
                  <Tag tag={tag} />
                </Grid>
              ))}
              <Grid item>
                <IconButton
                  onClick={() => explore(firstVendor!.rawFolderString)}
                  sx={{ cursor: 'pointer' }}
                >
                  <HiFolderOpen />
                </IconButton>
              </Grid>
            </Grid>
            <legend>New Tags (Space separated):</legend>
            <TextField
              fullWidth
              size="small"
              id="newTags"
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  merge();
                }
              }}
              disabled={isLoading}
              sx={{ mb: 2 }}
            />
            <legend>Merge with:</legend>
            <Paper sx={{ overflowY: 'scroll', height: 'calc(100vh - 340px)' }}>
              <RadioGroup name="mergeWith">
                <div className="flex gap-1 w-full">
                  <Radio
                    name="mergeWith"
                    value="none"
                    id="mergeWithNoneRadio"
                    defaultChecked={true}
                  />
                  <label className="grow h-6">None</label>
                </div>
                {bestMatches.map((vendor) => (
                  <div
                    key={vendor?.rawFolderString}
                    className="flex gap-1 w-full"
                  >
                    <Radio name="mergeWith" value={vendor?.rawFolderString} />
                    <label className="grow">{vendor?.rawFolderString}</label>
                    <a
                      href="#"
                      onClick={() => explore(vendor!.rawFolderString)}
                    >
                      <HiFolderOpen className="h-6" />
                    </a>
                  </div>
                ))}
              </RadioGroup>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button className="ml-auto" onClick={merge} disabled={isLoading}>
          {isLoading ? <CircularProgress /> : 'Merge'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
