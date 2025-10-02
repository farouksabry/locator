import { BrowserRouter } from "react-router"
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import AuthProvider from "./context/AuthContext.jsx"
import LocationsProvider from "./context/LocationsContext.jsx"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <LocationsProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </LocationsProvider>
    </BrowserRouter>
  </StrictMode>
)
