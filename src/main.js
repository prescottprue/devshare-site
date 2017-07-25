import React from 'react'
import ReactDOM from 'react-dom'
import { initScripts } from 'utils'
import createStore from './store/createStore'
import { version } from '../package.json'
import config, { env } from './config'
import './styles/core.scss'

// ========================================================
// Set Window Variables
// ========================================================
window.version = version
window.env = env
window.config = config
initScripts()

// Store Initialization
// ------------------------------------
const store = createStore(window.__INITIAL_STATE__)

// Render Setup
// ------------------------------------
const MOUNT_NODE = document.getElementById('root')

let render = () => {
  const App = require('./containers/App').default
  const routes = require('./routes/index').default(store)

  ReactDOM.render(
    <App store={store} routes={routes} />,
    MOUNT_NODE
  )
}

// Development Tools
// ------------------------------------
if (__DEV__) {
  if (module.hot) {
    const renderApp = render
    const renderError = (error) => {
      const RedBox = require('redbox-react').default

      ReactDOM.render(<RedBox error={error} />, MOUNT_NODE)
    }

    render = () => {
      try {
        renderApp()
      } catch (e) {
        console.error(e) // eslint-disable-line no-console
        renderError(e)
      }
    }

    // Setup hot module replacement
    module.hot.accept([
      './containers/App',
      './routes/index'
    ], () =>
      setImmediate(() => {
        ReactDOM.unmountComponentAtNode(MOUNT_NODE)
        render()
      })
    )
  }
}

// Let's Go!
// ------------------------------------
if (!__TEST__) render()
