import { createTheme } from '@mui/material/styles'

export default function createAppTheme(mode) {
  const dark = mode === 'dark'
  return createTheme({
    palette: {
      mode,
      primary: { main: '#10B981', dark: '#059669', contrastText: '#000000' },
      success: { main: '#10B981' },
      error: { main: '#EF4444' },
      background: {
        default: dark ? '#030712' : '#FFFFFF',
        paper: dark ? '#111827' : '#FFFFFF',
      },
      divider: dark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
      text: {
        primary: dark ? '#FFFFFF' : '#0F172A',
        secondary: dark ? '#94A3B8' : '#64748B',
        disabled: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)',
      },
    },
    typography: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    },
    shape: { borderRadius: 0 },
    components: {
      MuiTypography: {
        defaultProps: { fontFamily: 'inherit' },
        styleOverrides: {
          root: { fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
            borderRadius: 0,
            '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.divider },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(16,185,129,0.6)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#10B981', borderWidth: 1 },
          }),
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: { fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' },
        },
      },
      MuiFormLabel: {
        styleOverrides: {
          root: ({ theme }) => ({
            color: theme.palette.text.secondary,
            fontSize: '12px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: 4,
            '&.Mui-focused': { color: '#10B981' },
          }),
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { fontWeight: 700, textTransform: 'none', borderRadius: 0 },
          containedPrimary: { boxShadow: 'none', color: '#000', '&:hover': { boxShadow: 'none' } },
        },
      },
      MuiStepLabel: {
        styleOverrides: {
          root: { paddingTop: 0 },
        },
      },
    },
  })
}