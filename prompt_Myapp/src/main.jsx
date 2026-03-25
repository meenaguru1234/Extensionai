// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import App from './App';
  // import { ToastContainer } from 'react-toastify';
// import Parentcomponent from './Components/Pages/Parentcomponent.jsx'

createRoot(document.getElementById('root')).render(
  <>
    {/* <Parentcomponent/>
    <ToastContainer /> */}
    <App/>
  </>,
)
