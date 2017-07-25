import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { browserHistory, Router } from 'react-router'
import { Provider } from 'react-redux'
import { handleRouteUpdate } from 'utils/router'
import Notifications from 'containers/Notifications/Notifications'

// Themeing/Styling
import Theme from 'theme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

// Tap Plugin
import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()

export default class AppContainer extends Component {
  static childContextTypes = {
    muiTheme: PropTypes.object
  }

  static propTypes = {
    routes: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
  }

  getChildContext = () => ({
    muiTheme: getMuiTheme(Theme)
  })

  render () {
    const { routes, store } = this.props
    return (
      <Provider store={store}>
        <Router history={browserHistory} onUpdate={handleRouteUpdate}>
          {routes}
        </Router>
      </Provider>
    )
  }
}
