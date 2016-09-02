import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { devshare, helpers } from 'redux-devshare'
const { isLoaded, isEmpty, pathToJS } = helpers

import GoogleButton from 'react-google-button'
import Paper from 'material-ui/Paper'
// import CircularProgress from 'material-ui/CircularProgress'
import Snackbar from 'material-ui/Snackbar'
import LoginForm from '../components/LoginForm'
import { project as projectSettings } from '../../../config'
import classes from './LoginContainer.scss'

// Props decorators
@devshare()
@connect(
  ({devshare}) => ({
    authError: pathToJS(devshare, 'authError'),
    account: pathToJS(devshare, 'profile')
  })
)
export default class Login extends Component {
  static propTypes = {
    account: PropTypes.object,
    devshare: PropTypes.object,
    authError: PropTypes.object
  }

  static contextTypes = {
    router: PropTypes.object
  }

  state = {
    snackCanOpen: false
  }

  componentWillReceiveProps ({ authError, account }) {
    if (authError) {
      this.setState({
        isLoading: false
      })
    }
    if (account && account.username) {
      this.context.router.push(`projects/${account.username}`)
    }
  }

  handleRequestClose = () => this.setState({ snackCanOpen: false })

  handleLogin = loginData => {
    this.setState({
      snackCanOpen: true,
      isLoading: true
    })
    this.props.devshare.login(loginData)
  }

  googleLogin = () => {
    this.handleLogin({ provider: 'google', type: 'popup' })
  }

  render () {
    const { snackCanOpen } = this.state
    const { authError } = this.props

    // if (isLoading) {
    //   return (
    //     <div className={classes['container']}>
    //       <div className={classes['progress']}>
    //         <CircularProgress mode='indeterminate' />
    //       </div>
    //     </div>
    //   )
    // }

    return (
      <div className={classes['container']}>
        <Paper className={classes['panel']}>
          <LoginForm onLogin={this.handleLogin} />
        </Paper>
        <div className={classes['or']}>
          or
        </div>
        <GoogleButton onClick={this.googleLogin} />
        <div className={classes['signup']}>
          <span className={classes['signup-label']}>
            Need an account?
          </span>
          <Link className={classes['signup-link']} to='/signup'>
            Sign Up
          </Link>
        </div>
        <Snackbar
          open={isLoaded(authError) && !isEmpty(authError) && snackCanOpen}
          message={authError && authError.message ? authError.message : 'Error'}
          action='close'
          autoHideDuration={3000}
          onRequestClose={this.handleRequestClose}
        />
      </div>
    )
  }
}
