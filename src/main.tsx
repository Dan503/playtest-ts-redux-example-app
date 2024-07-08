import React from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'

import { worker } from './api/server'

import './index.css'
import { Provider } from 'react-redux'
import { store } from './app/store'
import { addPostListeners } from './features/posts/postsSlice'
import { apiSlice } from './app/apiSlice'

// Wrap app rendering so we can wait for the mock API to initialize
async function start() {
  // Start our mock API server
  await worker.start({ onUnhandledRequest: 'bypass' })

  store.dispatch(apiSlice.endpoints.getUsers.initiate())

  const root = createRoot(document.getElementById('root')!)
  addPostListeners()

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>,
  )
}

start()
