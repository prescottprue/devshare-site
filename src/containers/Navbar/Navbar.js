import React, { Component, PropTypes } from 'react'
import classes from './Navbar.scss'
import { Link } from 'react-router'
// Components
import AppBar from 'material-ui/AppBar'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import FlatButton from 'material-ui/FlatButton'
import Avatar from 'material-ui/Avatar'

const stockPhotoUrl = 'https://s3.amazonaws.com/kyper-cdn/img/User.png'
const originSettings = { horizontal: 'right', vertical: 'bottom' }
const buttonStyle = { color: 'white' }
const avatarSize = 50

// redux/devshare
import { connect } from 'react-redux'
import { devshare, helpers } from 'redux-devshare'
const { pathToJS } = helpers

// Decorators
@devshare()
@connect(
  ({devshare}) => ({
    authError: pathToJS(devshare, 'authError'),
    account: pathToJS(devshare, 'profile')
  })
)
export class Navbar extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  static propTypes = {
    account: PropTypes.object,
    devshare: PropTypes.object.isRequired
  }

  handleLogout = () =>
    this.props.devshare
      .logout()
      .then(() => this.context.router.push('/'))

  render () {
    const { account } = this.props

    const iconButton = (
      <Avatar
        className={classes['avatar']}
        src={account && account.avatar_url ? account.avatar_url : stockPhotoUrl}
        size={avatarSize}
      />
    )

    const mainMenu = (
      <div className={classes['menu']}>
        <Link to='/signup'>
          <FlatButton
            label='Sign Up'
            style={buttonStyle}
          />
        </Link>
        <Link to='/login'>
          <FlatButton
            label='Login'
            style={buttonStyle}
          />
        </Link>
      </div>
    )

    const rightMenu = account && account.email ? (
      <IconMenu
        iconButtonElement={iconButton}
        targetOrigin={originSettings}
        anchorOrigin={originSettings}
      >
        <MenuItem
          primaryText='Account'
          value='account'
        />
        <MenuItem
          primaryText='Sign out'
          value='logout'
          onClick={this.handleLogout}
        />
      </IconMenu>
    ) : mainMenu

    return (
      <AppBar
        title={
          <Link to='/' style={buttonStyle}>
            devshare
          </Link>
        }
        showMenuIconButton={false}
        iconElementRight={rightMenu}
      />
    )
  }
}

export default Navbar
