import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Global styles
const style = document.createElement('style')
style.textContent = `
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body, #root {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #0a0a0f;
  }

  body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Dragging cursor override */
  body.is-dragging {
    cursor: grabbing !important;
    user-select: none;
  }

  /* Piece glow pulse */
  @keyframes pulse {
    0%, 100% { opacity: 0.8; transform: scale(1); }
    50%       { opacity: 1;   transform: scale(1.4); }
  }

  @keyframes pulseDot {
    0%, 100% { opacity: 0.7; transform: scale(1); }
    50%       { opacity: 1;   transform: scale(1.5); }
  }

  /* Detail modal fade in */
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.97); }
    to   { opacity: 1; transform: scale(1); }
  }

  /* Scrollbar styling for detail modal */
  ::-webkit-scrollbar {
    width: 4px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.15);
    border-radius: 2px;
  }
`
document.head.appendChild(style)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
