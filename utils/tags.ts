import { purple, deepOrange, deepPurple } from '@mui/material/colors';

function createColor(
  color: any,
  lightTone: number = 100,
  darkTone: number = 900
) {
  return {
    backgroundColor: color[lightTone] as string,
    color: color[darkTone] as string,
  };
}

export const TAGS = {
  ZZZ: {
    tag: 'ZZZ',
    label: 'Hidden',
    ...createColor(deepOrange),
  },
  FAN: {
    tag: 'FAN',
    label: 'Fantasy',
    ...createColor(purple),
  },
  SCI: {
    tag: 'SCI',
    label: 'Sci-Fi',
    ...createColor(deepPurple),
  },
};
