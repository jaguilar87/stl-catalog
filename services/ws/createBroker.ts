import type { Server, Socket } from 'socket.io';

import { COMMANDS } from '@/utils/constants';
import { handleGetVendors } from './handleGetVendors';
import { handleExplore } from './handleExplore';
import { handleParse } from './handleParse';
import { handleMerge } from './handleMerge';
import { handleTag } from './handleTag';
import { handleGetGallery } from './handleGetGallery';

const isDebug = process.env.NODE_ENV === 'development';

export function createBroker(io: Server, socket: Socket) {
  if (isDebug) {
    socket.onAny((event, ...args) => console.debug('ws    -', event, args));
  }

  socket.on(COMMANDS.GET_VENDORS, handleGetVendors);
  socket.on(COMMANDS.EXPLORE, handleExplore);
  socket.on(COMMANDS.PARSE, handleParse);
  socket.on(COMMANDS.MERGE, handleMerge);
  socket.on(COMMANDS.TAG, handleTag);
  socket.on(COMMANDS.GET_GALLERY, handleGetGallery);
}
