import { theme } from 'antd';

// Theme configuration type definition
export interface CustomThemeConfig {
  name: string;
  displayName: string;
  token?: {
    colorPrimary?: string;
    colorInfo?: string;
    colorPrimaryHover?: string;
    colorSuccess?: string;
    colorError?: string;
    colorLink?: string;
    wireframe?: boolean;
    borderRadius?: number;
    [key: string]: any;
  };
  algorithm?: any[];
  [key: string]: any;
}

// Default purple theme configuration
export const defaultTheme: CustomThemeConfig = {
  name: 'default',
  displayName: 'Default Theme',
  token: {
    colorPrimary: "#88cf04ff",
    colorInfo: "#d39613ff",
    colorPrimaryHover: '#90db04ff',
    colorSuccess: '#c0fc29',
    colorError: '#f53a3d',
    colorLink: '#6fbc17ff',
    wireframe: false,
    borderRadius: 8
  },
  algorithm: [
    theme.compactAlgorithm
  ]
};


// List of all available themes
export const availableThemes: CustomThemeConfig[] = [
  defaultTheme,
];

// Get theme configuration by theme name
export const getThemeByName = (name: string): CustomThemeConfig => {
  const foundTheme = availableThemes.find(t => t.name === name);
  return foundTheme || defaultTheme;
};
