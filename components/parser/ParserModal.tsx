import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';
import { useModal } from '@/services/providers/ModalsProvider';
import { useWs } from '@/services/providers/WSProvider';
import { COMMANDS } from '@/utils/constants';
import { ParserResponse } from './ParserResponse';
import type { ParserResponseDto } from '@/types';

export function ParserModal() {
  const [isLoading, setIsLoading] = useState(false);
  const [log, setLog] = useState<ParserResponseDto[]>([]);
  const { isOpen, close } = useModal('parser');
  const { socket } = useWs();

  const parse = () => {
    setIsLoading(true);
    setLog([]);
    const folderName = document.getElementById(
      'folderName'
    ) as HTMLInputElement;
    socket?.emit(COMMANDS.PARSE, folderName.value, cb);
  };

  const cb = (msgs: ParserResponseDto[]) => {
    console.log(msgs);
    setLog(msgs);
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen()} onClose={close}>
      <DialogTitle>Import new vendors</DialogTitle>
      <DialogContent>
        <div className="space-y-6">
          {log.length || isLoading ? (
            <div className="bg-gray-900 p-2 w-full h-96 overflow-y-scroll flex flex-col">
              {log.map(({ type, msg, name }, index) => (
                <ParserResponse key={index} msg={msg} type={type} name={name} />
              ))}
            </div>
          ) : (
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Select a folder to import...
            </p>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <TextField
          className="grow"
          id="folderName"
          placeholder="Input a folder route"
          required={true}
          disabled={isLoading}
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              parse();
            }
          }}
        />
        <Button onClick={parse} disabled={isLoading}>
          {isLoading ? <CircularProgress /> : 'Import'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
