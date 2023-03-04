import React, { useCallback, useMemo, useState } from 'react';
import ss from 'string-similarity';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Radio,
  TextField,
  Button,
  CircularProgress,
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

  if (!isOpen()) return null;

  if (!firstVendor) {
    return (
      <Dialog open={isOpen()} onClose={close}>
        <DialogTitle>Merge Vendors</DialogTitle>
        <DialogContent>
          <div className="space-y-6 columns-2">
            <div>
              <p>There is no suspicious vendors. Nice!</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen()} onClose={close}>
      <DialogTitle>Merge Vendors</DialogTitle>
      <DialogContent>
        <div className="flex w-full flex-row gap-4">
          <div className="w-full">
            <p>There is {sussyVendors.length} suspicious vendors.</p>
            <div className="flex bg-gray-900 text-gray-200 p-2 text-center text-xl border font-bold">
              <div className="grow">
                <span className="mr-1">
                  {firstVendor?.label ?? firstVendor?.rawFolderString}
                </span>
                <sup className="inline-flex gap-1">
                  {Array.from(firstVendor!.tags).map((tag) => (
                    <Tag key={tag} tag={tag} />
                  ))}
                </sup>
              </div>
              <a href="#" onClick={() => explore(firstVendor!.rawFolderString)}>
                <HiFolderOpen className="h-8" />
              </a>
            </div>

            <Gallery
              path={firstVendor!.rawFolderString}
              className="h-72 w-72 mx-auto mt-2"
            />
          </div>
          <div className="w-full">
            <legend>New Tags (Space separated):</legend>
            <TextField
              id="newTags"
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  merge();
                }
              }}
              disabled={isLoading}
            />
            <legend className="mt-2">Merge with:</legend>
            <div className="bg-gray-900 text-gray-200 p-2 mt-0 border border-gray-500 flex flex-col h-60 overflow-y-scroll">
              <fieldset id="mergeWith">
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
              </fieldset>
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button className="ml-auto" onClick={merge} disabled={isLoading}>
          {isLoading ? <CircularProgress /> : 'Merge'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
