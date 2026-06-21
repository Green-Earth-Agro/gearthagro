import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../index.css'; // shared agro-* design tokens + Tailwind base
import App from './App';

createRoot(document.getElementById('admin-root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
