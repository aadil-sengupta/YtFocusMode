import { createRoot } from 'react-dom/client';
import SettingsPage from './SettingsPage.tsx';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<SettingsPage />);
}
