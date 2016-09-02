import React from 'react'
import classes from './Login.scss'
import GoogleButton from 'react-google-button'
import Paper from 'material-ui/Paper'
import LoginForm from './LoginForm'
import { Link } from 'react-router'

export const Login = ({ googleLogin, handleLogin }) => (
  <div className={classes['Login']}>
    <Paper className='Login-Panel'>
      <LoginForm onLogin={handleLogin} />
    </Paper>
    <div className='Login-Or'>
      or
    </div>
    <GoogleButton onClick={googleLogin} />
    <div className={classes['Signup']}>
      <span className={classes['Label']}>
        Need an account?
      </span>
      <Link className={classes['Signup-Link']} to='/signup'>
        Sign Up
      </Link>
    </div>
  </div>
)

export default Login
