import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
  },
  components: {
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: '.75rem',
          lineHeight: '1rem',
          padding: '0.125rem 0.625rem',
          borderRadius: '0.25rem',
          '&+&': {
            marginLeft: '0.25rem',
          },
        },
        label: {
          padding: 0,
        },
      },
    },
  },
});
