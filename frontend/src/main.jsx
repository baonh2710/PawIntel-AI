import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.jsx'
import ImageAnalyzer from './components/ImageAnalyzer'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ImageAnalyzer></ImageAnalyzer>
  </StrictMode>,
)
