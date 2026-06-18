import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createTheme, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import './styles/theme.css';
import App from './App';

const theme = createTheme({
  fontFamily: "'DM Sans', 'Helvetica Neue', system-ui, sans-serif",
  fontFamilyMonospace: "'JetBrains Mono', monospace",
  headings: {
    fontFamily: "'Fraunces', 'Times New Roman', serif",
    fontWeight: '500',
  },
  primaryColor: 'dark',
  defaultRadius: 'md',
  colors: {
    brass: [
      '#fbf5e8', '#f5e7c9', '#ebd29e', '#deb870', '#cf9f4b',
      '#b08b47', '#8e6d30', '#6e5422', '#4f3c18', '#31260f',
    ],
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="light">
      <Notifications position="top-right" />
      <App />
    </MantineProvider>
  </StrictMode>,
);
