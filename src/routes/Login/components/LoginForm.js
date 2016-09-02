import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import Checkbox from 'material-ui/Checkbox'
import { Field, reduxForm } from 'redux-form'

import classes from './LoginForm.scss'
const buttonStyle = {width: '100%'}

const renderTextField = ({ input, label, meta: { touched, error }, ...custom }) => (
  <TextField hintText={label}
    floatingLabelText={label}
    errorText={touched && error}
    {...input}
    {...custom}
  />
)
renderTextField.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  meta: PropTypes.object
}

export const fields = [ 'email', 'password' ]

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
        <Field name='email' component={renderTextField} label='Email' />
      </div>
      <div>
        <Field name='password' component={renderTextField} label='Password' />
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
      <div className='LoginForm-Options'>
        <div className='LoginForm-Remember'>
          <Checkbox
            name='remember'
            value='remember'
            label='Remember'
            labelStyle={{ fontSize: '.8rem' }}
          />
        </div>
        <Link className='LoginForm-Recover-Link' to='/recover'>
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
  fields,
  validate
})(LoginForm)
