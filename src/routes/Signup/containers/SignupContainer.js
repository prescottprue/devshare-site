import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import GoogleButton from 'react-google-button'

// Components
import SignupForm from '../components/SignupForm'
import Paper from 'material-ui/Paper'
import CircularProgress from 'material-ui/CircularProgress'
import Snackbar from 'material-ui/Snackbar'

import classes from './SignupContainer.scss'

// redux-devsharev3
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
export default class Signup extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  }
  static propTypes = {
    account: PropTypes.object,
    devshare: PropTypes.object,
    authError: PropTypes.object
  }

  state = {
    snackCanOpen: false,
    errors: { username: null, password: null }
  }

  // componentWillReceiveProps ({ account, history, location }) {
  //   console.log('component will recieve props', account, location)
  //   if (account && account.username && location.pathname === '/signup') {
  //     // this.context.router.push(`/projects/${account.username}`)
  //   }
  // }

  reset = () =>
    this.setState({
      errors: {},
      username: null,
      email: null,
      name: null
    })

  handleSignup = (creds) => {
    this.setState({ snackCanOpen: true })
    this.props.devshare.signup(creds)
      .then((account) => {
        console.log('account after signup', account)
        this.context.router.push(`/projects/${account.username}`)
      })
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
        <div className={classes['container']}>
          <div className='Signup-Progress'>
            <CircularProgress mode='indeterminate' />
          </div>
        </div>
      )
    }

    return (
      <div className={classes['container']}>
        <Paper className={classes['panel']}>
          <SignupForm onSubmit={this.handleSignup} />
        </Paper>
        <div className={classes['providers']}>
          <GoogleButton onClick={this.googleLogin} />
        </div>
        <div className={classes['login']}>
          <span className={classes['login-label']}>
            Already have an account?
          </span>
          <Link className={classes['login-link']} to='/login'>
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
