import React from 'react';
import {
  HiExclamationCircle,
  HiQuestionMarkCircle,
  HiTrash,
  HiFolderPlus,
  HiCheckCircle,
} from 'react-icons/hi2';

import { COMMANDS, PARSE_MSGS } from '@/utils/constants';
import { useWs } from '@/services/providers/WSProvider';
import type { ParserResponseDto } from '@/types';

export function ParserResponse({ msg, type, name }: ParserResponseDto) {
  const { socket } = useWs();

  const openVendorsFolder = () => {
    socket?.emit(COMMANDS.EXPLORE, name ? name : '');
  };

  let icon = <HiQuestionMarkCircle className="h-6 text-blue-400" />;
  let cat = null;

  if (type === PARSE_MSGS.ERROR || type === PARSE_MSGS.MULTIPLE_MATCHES) {
    icon = <HiExclamationCircle className="text-red-500 h-6" />;
    cat = (
      <a href="#" onClick={openVendorsFolder}>
        See folder
      </a>
    );
  }

  if (type === PARSE_MSGS.DELETED) {
    icon = <HiTrash className="text-violet-500 h-6" />;
  }

  if (type === PARSE_MSGS.NEW_VENDOR) {
    icon = <HiFolderPlus className="text-blue-300 h-6" />;
    cat = (
      <a href="#" onClick={openVendorsFolder}>
        See vendor
      </a>
    );
  }

  if (type === PARSE_MSGS.SUCCESS) {
    icon = <HiCheckCircle className="text-green-500 h-6" />;
  }

  return (
    <div className="flex gap-1">
      {icon}
      <div className="grow">{msg}</div>
      <div>{cat}</div>
    </div>
  );
}
