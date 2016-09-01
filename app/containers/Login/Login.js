import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import GoogleButton from 'react-google-button'

// Components
import LoginForm from '../../components/LoginForm/LoginForm'
import Paper from 'material-ui/Paper'
import CircularProgress from 'material-ui/CircularProgress'
import Snackbar from 'material-ui/Snackbar'

// Styling
import './Login.scss'

// redux/devshare
import { connect } from 'react-redux'
import { devshare, helpers } from 'redux-devshare'
const { pathToJS } = helpers

@devshare()
@connect(
  // Map state to props
  ({devshare}) => ({
    authError: pathToJS(devshare, 'authError'),
    account: pathToJS(devshare, 'profile')
  })
)
export default class Login extends Component {

  static propTypes = {
    devshare: PropTypes.object,
    authError: PropTypes.object,
    account: PropTypes.object
  }

  componentWillReceiveProps ({ account, history }) {
    if (account && account.username) {
      history.push(`/${account.username}`)
    }
  }

  handleLogin = (loginData) => {
    this.setState({ snackCanOpen: true })
    this.props.devshare.login(loginData)
  }

  googleLogin = () => {
    this.setState({ snackCanOpen: true })
    this.props.devshare.login({ provider: 'google', type: 'popup' })
  }

  render () {
    const { account, authError } = this.props

    // Loading spinner
    if (account && account.isFetching) {
      return (
        <div className='Login'>
          <div className='Login-Progress'>
            <CircularProgress mode='indeterminate' />
          </div>
        </div>
      )
    }

    return (
      <div className='Login'>
        <Paper className='Login-Panel'>
          <LoginForm onLogin={this.handleLogin} />
        </Paper>
        <div className='Login-Or'>
          <span>or</span>
        </div>
        <div className='Login-Providers'>
          <GoogleButton onClick={this.googleLogin} />
        </div>
        <div className='Login-Signup'>
          <span className='Login-Signup-Label'>
            Need an account?
          </span>
          <Link className='Login-Signup-Link' to='/signup'>
            Signup
          </Link>
        </div>
        {
          authError && authError.message
          ? <Snackbar
            open={authError && !!authError.message}
            message={authError.message || 'Error'}
            action='close'
            autoHideDuration={4000}
            onRequestClose={this.handleRequestClose}
            />
          : null
        }
      </div>
    )
  }
}
