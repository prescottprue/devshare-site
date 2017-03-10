import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { devshare } from 'redux-devshare'
import { firebaseConnect, pathToJS, isLoaded, isEmpty } from 'react-redux-firebase'
import GoogleButton from 'react-google-button'
import Paper from 'material-ui/Paper'
import RaisedButton from 'material-ui/RaisedButton'
import Snackbar from 'material-ui/Snackbar'
import GithubIcon from 'react-icons/lib/go/mark-github'
import FontIcon from 'material-ui/FontIcon'
import { UserIsNotAuthenticated } from 'utils/router'
import { paths } from 'constants'
import LoadingSpinner from 'components/LoadingSpinner'
import SignupForm from '../components/SignupForm/SignupForm'

import classes from './SignupContainer.scss'

@UserIsNotAuthenticated // redirect to home if logged in
@devshare()
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
    devshare: PropTypes.object,
    authError: PropTypes.object
  }

  state = {
    snackCanOpen: false
  }

  handleRequestClose = () =>
    this.setState({
      snackCanOpen: false
    })

  handleSignup = (creds) => {
    this.setState({ snackCanOpen: true })
    this.props
      // .devshare // devshare method
      // .signup(creds)
      .firebase // firebase method
      .createUser(creds, { email: creds.email, username: creds.username })
      .then(account => {
        this.context.router.push(`${account.username}`)
      })
  }

  providerLogin = (provider) => {
    this.setState({ snackCanOpen: true })
    this.props.firebase
      .login({ provider })
      .then(account =>
        this.context.router.push(`${account.username}`)
      )
  }

  render () {
    const { authError, account } = this.props
    const { snackCanOpen } = this.state

    if (!isLoaded(account)) {
      return <LoadingSpinner />
    }

    return (
      <div className={classes.container}>
        <Paper className={classes.panel}>
          <SignupForm onSubmit={this.handleSignup} />
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
              <FontIcon className={classes.githubIcon}>
                <GithubIcon />
              </FontIcon>
            }
          />
        </div>
        <div className={classes.login}>
          <span className={classes.loginLabel}>
            Already have an account?
          </span>
          <Link className={classes.loginLink} to={paths.login}>
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
