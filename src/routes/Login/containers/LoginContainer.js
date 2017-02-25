import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { firebaseConnect, pathToJS, isLoaded, isEmpty } from 'react-redux-firebase'
// import { UserIsNotAuthenticated } from 'utils/router'

import GoogleButton from 'react-google-button'
import Paper from 'material-ui/Paper'
import Snackbar from 'material-ui/Snackbar'
import FontIcon from 'material-ui/FontIcon'
import RaisedButton from 'material-ui/RaisedButton'
import GithubIcon from 'react-icons/lib/go/mark-github'
import LoadingSpinner from 'components/LoadingSpinner'
import LoginForm from '../components/LoginForm/LoginForm'

import classes from './LoginContainer.scss'

// @UserIsNotAuthenticated // redirect to home if logged in
@firebaseConnect()
@connect(
  ({firebase}) => ({
    authError: pathToJS(firebase, 'authError'),
    account: pathToJS(firebase, 'profile')
  })
)
export default class Login extends Component {
  static propTypes = {
    account: PropTypes.object,
    firebase: PropTypes.object,
    authError: PropTypes.object
  }

  static contextTypes = {
    router: PropTypes.object
  }

  state = {
    snackCanOpen: false
  }

  handleLogin = loginData => {
    this.setState({ snackCanOpen: true })
    this.props.firebase
      .login(loginData)
      .then(account => this.context.router.push(`/${account.username}`))
  }

  providerLogin = (provider) =>
    this.handleLogin({ provider, type: 'popup' })

  render () {
    const { isLoading, snackCanOpen } = this.state
    const { authError } = this.props

    if (isLoading && !authError) {
      return <LoadingSpinner />
    }

    return (
      <div className={classes.container}>
        <Paper className={classes.panel}>
          <LoginForm onSubmit={this.handleLogin} />
        </Paper>
        <div className={classes.or}>
          or
        </div>
        <div className={classes.providers}>
          <GoogleButton onClick={() => this.providerLogin('google')} />
        </div>
        <div className={classes.providers}>
          <RaisedButton
            className={classes.github}
            onClick={() => this.providerLogin('github')}
            label='Sign in with Github'
            icon={
              <FontIcon className={classes['github-icon']}>
                <GithubIcon />
              </FontIcon>
            }
          />
        </div>
        <div className={classes.signup}>
          <span className={classes['signup-label']}>
            Need an account?
          </span>
          <Link className={classes['signup-link']} to='/signup'>
            Sign Up
          </Link>
        </div>
        {
          isLoaded(authError) && !isEmpty(authError) && snackCanOpen
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
