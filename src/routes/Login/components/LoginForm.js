import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import TextField from '../../../components/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import Checkbox from 'material-ui/Checkbox'
import { Field, reduxForm } from 'redux-form'

import classes from './LoginForm.scss'
const buttonStyle = {width: '100%'}

const validate = values => {
  const errors = {}
  if (!values.email) errors.email = 'Required'
  if (!values.password) errors.password = 'Required'
  return errors
}

const LoginForm = props => {
  const { handleSubmit, submitting } = props
  return (
    <form className={classes['container']} onSubmit={handleSubmit}>
      <div>
        <Field
          name='email'
          component={TextField}
          label='Email'
        />
      </div>
      <div>
        <Field
          name='password'
          component={TextField}
          label='Password'
        />
      </div>
      <div className={classes['submit']}>
        <RaisedButton
          label='Login'
          primary
          type='submit'
          disabled={submitting}
          style={buttonStyle}
        />
      </div>
      <div className={classes['options']}>
        <div className={classes['remember']}>
          <Checkbox
            name='remember'
            value='remember'
            label='Remember'
            labelStyle={{ fontSize: '.8rem' }}
          />
        </div>
        <Link className={classes['recover']} to='/recover'>
          Forgot Password?
        </Link>
      </div>
    </form>
  )
}
LoginForm.propTypes = {
  handleSubmit: PropTypes.func,
  submitting: PropTypes.bool
}

export default reduxForm({
  form: 'Login',
  validate
})(LoginForm)
