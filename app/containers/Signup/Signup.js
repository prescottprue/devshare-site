import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import GoogleButton from 'react-google-button'

// Components
import SignupForm from '../../components/SignupForm/SignupForm'
import Paper from 'material-ui/Paper'
import CircularProgress from 'material-ui/CircularProgress'
import Snackbar from 'material-ui/Snackbar'

// Styles
import './Signup.scss'

// redux-devsharev3
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
export default class Signup extends Component {

  static propTypes = {
    account: PropTypes.object,
    devshare: PropTypes.object,
    authError: PropTypes.object
  }

  state = {
    snackCanOpen: false,
    errors: { username: null, password: null }
  }

  componentWillReceiveProps ({ account, history }) {
    if (account && account.username) {
      history.push(`/${account.username}`)
    }
  }

  reset = () =>
    this.setState({
      errors: {},
      username: null,
      email: null,
      name: null
    })

  handleSignup = ({ email, password, username }) => {
    this.setState({ snackCanOpen: true })
    this.props.devshare.createUser({ email, password }, { username, email })
  }

  googleLogin = () => {
    this.setState({ snackCanOpen: true })
    this.props.devshare.login({ provider: 'google', type: 'popup' })
  }

  render () {
    const { account, authError } = this.props
    const { snackCanOpen } = this.state

    if (account && account.isFetching) {
      return (
        <div className='Signup'>
          <div className='Signup-Progress'>
            <CircularProgress mode='indeterminate' />
          </div>
        </div>
      )
    }

    return (
      <div className='Signup'>
        <Paper className='Signup-Panel'>
          <SignupForm onSignup={this.handleSignup} />
        </Paper>
        <div className='Signup-Or'>
          <span>or</span>
        </div>
        <div className='Signup-Providers'>
          <GoogleButton onClick={this.googleLogin} />
        </div>
        <div className='Signup-Login'>
          <span className='Signup-Login-Label'>
            Already have an account?
          </span>
          <Link className='Signup-Login-Link' to='/login'>
            Login
          </Link>
        </div>
        {
          authError && authError.message && snackCanOpen
          ? <Snackbar
            open={authError && !!authError.message}
            message={authError ? authError.message : 'Signup error'}
            action='close'
            autoHideDuration={3000}
          />
          : null
        }
      </div>
    )
  }
}
