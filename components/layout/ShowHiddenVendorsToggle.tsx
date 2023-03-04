import React from 'react';
import { HiEye, HiEyeSlash } from 'react-icons/hi2';
import { Tooltip, SvgIcon } from '@mui/material';

import { useFilters } from '@/services/providers/FiltersProvider';

export function ShowHiddenVendorsToggle() {
  const { toggleShowHiddenVendors, showHiddenVendors } = useFilters();

  if (showHiddenVendors) {
    return (
      <Tooltip title="Do not show hidden vendors">
        <SvgIcon>
          <HiEyeSlash onClick={toggleShowHiddenVendors} />
        </SvgIcon>
      </Tooltip>
    );
  }

  return (
    <Tooltip title="Show hidden vendors">
      <SvgIcon>
        <HiEye onClick={toggleShowHiddenVendors} />
      </SvgIcon>
    </Tooltip>
  );
}
