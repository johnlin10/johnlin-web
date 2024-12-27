import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import './i18n/i18n'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import reportWebVitals from './reportWebVitals'
import { Provider } from 'react-redux'
import store from './redux/store'

import { HelmetProvider } from 'react-helmet-async'

const root = ReactDOM.createRoot(document.getElementById('app'))
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <HelmetProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </HelmetProvider>
    </BrowserRouter>
  </React.StrictMode>
)

serviceWorkerRegistration.unregister()
reportWebVitals()
