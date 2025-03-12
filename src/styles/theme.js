// Application theme with colors, typography, spacing, etc.

// Color palette
const palette = {
  // Primary colors
  blue: {
    light: '#4DA6FF',
    main: '#0074D9',
    dark: '#004B8C',
  },
  // Secondary colors
  green: {
    light: '#7BCC70',
    main: '#2ECC40',
    dark: '#1B7926',
  },
  // Neutrals
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  // Status/feedback colors
  red: {
    light: '#FF6B6B',
    main: '#FF4136',
    dark: '#CF0E00',
  },
  yellow: {
    light: '#FFDC73',
    main: '#FFCC00',
    dark: '#CC9900',
  },
  // Other colors
  white: '#FFFFFF',
  black: '#000000',
};

// Theme object
export const theme = {
  // Colors used throughout the app
  colors: {
    primary: palette.blue.main,
    primaryLight: palette.blue.light,
    primaryDark: palette.blue.dark,
    
    secondary: palette.green.main,
    secondaryLight: palette.green.light,
    secondaryDark: palette.green.dark,
    
    accent: palette.blue.light,
    
    background: palette.gray[50],
    cardBackground: palette.white,
    border: palette.gray[200],
    
    text: palette.gray[900],
    textSecondary: palette.gray[500],
    textDisabled: palette.gray[400],
    
    success: palette.green.main,
    error: palette.red.main,
    warning: palette.yellow.dark,
    info: palette.blue.light,
    
    warningBackground: '#FFF9E6',
    errorBackground: '#FFEAEA',
    successBackground: '#E6FFEE',
    infoBackground: '#E6F4FF',
  },
  
  // Typography styles
  typography: {
    fontFamily: {
      base: 'System',
      heading: 'System',
    },
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 30,
    },
    fontWeight: {
      light: '300',
      regular: '400',
      medium: '500',
      semiBold: '600',
      bold: '700',
    },
  },
  
  // Spacing values for consistent margins, paddings, etc.
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },
  
  // Border radius values
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    round: '50%',
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  
  // Animation durations
  animation: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  
  // Z-index values for layering
  zIndex: {
    modal: 1000,
    overlay: 900,
    dropdown: 800,
    header: 700,
    footer: 600,
  },
};

// Helper functions for theme usage
export const getSpacing = (multiplier = 1) => {
  return theme.spacing.md * multiplier;
};

export const getColor = (colorPath) => {
  const keys = colorPath.split('.');
  let value = theme.colors;
  
  for (const key of keys) {
    value = value[key];
    if (value === undefined) return undefined;
  }
  
  return value;
};

export default theme;
