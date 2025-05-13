
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { auth } from './components/auth/firebase-config';

// Make sure Firebase is initialized
const renderApp = () => {
  createRoot(document.getElementById("root")!).render(<App />);
};

// Check if auth is already initialized
if (auth) {
  renderApp();
} else {
  // If not initialized for some reason, wait a bit and try again
  setTimeout(renderApp, 100);
}
