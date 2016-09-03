import React, { Component, PropTypes } from 'react'

// Components
import AccountDialog from '../components/AccountDialog/AccountDialog'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

import classes from './AccountContainer.scss'

const textFieldStyle = { width: '60%' }
const buttonStyle = { 'marginTop': '2rem', width: '20%' }
const defaultUserImageUrl = 'https://s3.amazonaws.com/kyper-cdn/img/User.png'

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
export default class Account extends Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  static propTypes = {
    account: PropTypes.object,
    logout: PropTypes.func,
    devshare: PropTypes.shape({
      logout: PropTypes.func.isRequired
    }),
    uploadAvatar: PropTypes.func,
    updateAccount: PropTypes.func
  }

  state = { modalOpen: false }

  handleLogout = () =>
    this.props.devshare
      .logout()
      .then(() => this.context.router.push('/'))

  handleSave = () => {
    // TODO: Handle saving image and account data at the same time
    const account = {
      name: this.refs.name.getValue(),
      email: this.refs.email.getValue()
    }
    this.props.updateAccount(account)
  }

  handleAvatarUpload = imageFile => {
    this.props.uploadAvatar(imageFile)
  }

  toggleModal = () => {
    this.setState({
      modalOpen: !this.state.modalOpen
    })
  }

  render () {
    const { account } = this.props
    return (
      <div className={classes['container']}>
        <AccountDialog
          modalOpen={this.state.modalOpen}
          toggleModal={this.toggleModal}
          onSave={this.handleAvatarUpload}
        />
        <div className={classes['settings']}>
          <div className={classes['avatar']}>
            <img
              className={classes['avatar-current']}
              src={account && account.avatarUrl || defaultUserImageUrl}
              onClick={this.toggleModal}
            />
          </div>
          <div className={classes['meta']}>
            <TextField
              hintText='Email'
              floatingLabelText='Email'
              ref='email'
              defaultValue={account && account.email || 'No Email'}
              style={textFieldStyle}
            />
            <RaisedButton
              primary
              label='Save'
              onClick={this.handleSave}
              style={buttonStyle}
            />
            <RaisedButton
              label='Logout'
              onClick={this.handleLogout}
              style={buttonStyle}
            />
          </div>
        </div>
      </div>
    )
  }
}
