import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from "axios"; // ✅ ADD THIS
import './index.css'
import App from './App.jsx'

axios.defaults.withCredentials = true;

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <App />
  // </StrictMode>,
)