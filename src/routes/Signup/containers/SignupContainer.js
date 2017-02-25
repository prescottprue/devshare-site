import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { firebaseConnect, pathToJS, isLoaded } from 'react-redux-firebase'
// import { UserIsNotAuthenticated } from 'utils/router'

import GoogleButton from 'react-google-button'
import Paper from 'material-ui/Paper'
import RaisedButton from 'material-ui/RaisedButton'
import CircularProgress from 'material-ui/CircularProgress'
import Snackbar from 'material-ui/Snackbar'
import GithubIcon from 'react-icons/lib/go/mark-github'
import FontIcon from 'material-ui/FontIcon'
import SignupForm from '../components/SignupForm/SignupForm'

import classes from './SignupContainer.scss'

// @UserIsNotAuthenticated // redirect to home if logged in
@firebaseConnect()
@connect(
  ({firebase}) => ({
    authError: pathToJS(firebase, 'authError'),
    account: pathToJS(firebase, 'profile')
  })
)
export default class Signup extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  }
  static propTypes = {
    account: PropTypes.object,
    firebase: PropTypes.object,
    authError: PropTypes.object
  }

  state = {
    snackCanOpen: false,
    isLoading: false
  }

  handleRequestClose = () =>
    this.setState({
      snackCanOpen: false
    })

  handleSignup = (creds) => {
    this.setState({
      snackCanOpen: true,
      isLoading: true
    })
    this.props.firebase
      .signup(creds)
      .then(account =>
        this.context.router.push(`${account.username}`)
      )
  }

  providerLogin = (provider) => {
    this.setState({
      snackCanOpen: true,
      isLoading: true
    })
    this.props.firebase
      .login({ provider, type: 'popup' })
      .then(account =>
        this.context.router.push(`${account.username}`)
      )
  }

  render () {
    const { authError } = this.props
    const { snackCanOpen, isLoading } = this.state

    if (isLoading && !authError) {
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
        <div className={classes['or']}>
          or
        </div>
        <div className={classes['providers']}>
          <GoogleButton onClick={() => this.providerLogin('google')} />
        </div>
        <div className={classes['providers']}>
          <RaisedButton
            className={classes['github']}
            onClick={() => this.providerLogin('github')}
            label='Sign in with Github'
            icon={
              <FontIcon className={classes['github-icon']}>
                <GithubIcon />
              </FontIcon>
            }
          />
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
              open={isLoaded(authError) && !isEmpty(authError) && snackCanOpen}
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
