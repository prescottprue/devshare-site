import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { devshare, helpers } from 'redux-devshare'
const { isLoaded, isEmpty, pathToJS } = helpers

import GoogleButton from 'react-google-button'
import Paper from 'material-ui/Paper'
import CircularProgress from 'material-ui/CircularProgress'
import Snackbar from 'material-ui/Snackbar'
import LoginForm from '../components/LoginForm'
import { project as projectSettings } from '../../../config'

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
    snackCanOpen: false,
    errorMessage: null
  }
  
  componentWillReceiveProps (nextProps) {
    const { account, authError } = nextProps
    if (authError) {
      this.setState({
        isLoading: false
      })
    }
  }

  handleRequestClose = () => this.setState({ snackCanOpen: false })

  handleLogin = loginData => {
    this.setState({
      snackCanOpen: true,
      isLoading: true
    })
    this.props.devshare.login(loginData)
        .then(() => this.context.router.push(`/${projectSettings.postLoginRoute}`))
  }

  googleLogin = () => {
    // TODO: Handle Google Login
    console.log('google')
  }

  render () {
    const { isLoading, snackCanOpen, errorMessage } = this.state
    const { authError } = this.props

    if (isLoading) {
      return (
        <div className='Login'>
          <div className='Login-Progress'>
            <CircularProgress  mode='indeterminate' />
          </div>
        </div>
      )
    }

    return (
      <div className='Login'>
        <Paper className='Login-Panel'>
          <LoginForm onLogin={ this.handleLogin } />
        </Paper>
        <div className='Login-Or'>
          or
        </div>
        <GoogleButton onClick={ this.googleLogin } />
        <div className='Login-Signup'>
          <span className='Login-Signup-Label'>
            Need an account?
          </span>
          <Link className='Login-Signup-Link' to='/signup'>
            Sign Up
          </Link>
        </div>
        <Snackbar
          open={ isLoaded(authError) && !isEmpty(authError) && snackCanOpen }
          message={ authError ? authError.toString() : 'Error' }
          action='close'
          autoHideDuration={ 3000 }
          onRequestClose={ this.handleRequestClose }
        />
      </div>
    )

  }
}
