import React from 'react';
import { Chip } from '@mui/material';
import { TAGS } from '@/utils/tags';

type PropTypes = {
  tag: string;
};

export function Tag({ tag }: PropTypes) {
  const { backgroundColor, color, label } = TAGS[tag as keyof typeof TAGS] || {
    label: tag,
    color: 'info',
  };

  return <Chip sx={{ backgroundColor, color }} label={label} size="small" />;
}
