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

import { connect } from 'react-redux'
import { devshare, helpers } from 'redux-devshare'
const { isLoaded, isEmpty, pathToJS } = helpers

// Decorators
@devshare()
@connect(
  ({devshare}) => ({
    authError: pathToJS(devshare, 'authError'),
    account: pathToJS(devshare, 'profile')
  })
)
export class Navbar extends Component {
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
      <div className='Navbar-Main-Menu'>
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
        className={classes['Navbar']}
        showMenuIconButton={false}
        iconElementRight={rightMenu}
      />
    )
  }
}

Navbar.propTypes = {
  account: PropTypes.object
}

export default Navbar
