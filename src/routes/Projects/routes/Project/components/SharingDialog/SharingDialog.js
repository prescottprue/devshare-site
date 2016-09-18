import React, { Component, PropTypes } from 'react'

import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'
import { List, ListItem } from 'material-ui/List'
import AutoComplete from 'material-ui/AutoComplete'
import Avatar from 'material-ui/Avatar'
import PersonIcon from 'material-ui/svg-icons/social/person'
import RemoveIcon from 'material-ui/svg-icons/content/remove-circle'
import Colors from 'material-ui/styles/colors'
import classes from './SharingDialog.scss'
import { map } from 'lodash'

export default class SharingDialog extends Component {

  state = {
    error: null
  }

  static propTypes = {
    project: PropTypes.object.isRequired,
    open: PropTypes.bool,
    error: PropTypes.object,
    onRequestClose: PropTypes.func,
    searchUsers: PropTypes.func.isRequired,
    onAddCollab: PropTypes.func.isRequired,
    onRemoveCollab: PropTypes.func.isRequired
  }

  componentDidMount () {
    this.setState({
      collaborators: this.props.project ? this.props.project.collaborators : []
    })
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.open) {
      this.setState({
        open: nextProps.open
      })
    }
  }

  searchAccounts = q =>
    this.props.searchUsers(q)
      .then(matchingUsers =>
        this.setState({
          matchingUsers: map(matchingUsers, (user, key) =>
            Object.assign(user, { key })
          )
        })
      )
      .catch(error => this.setState({ error }))

  selectNewCollab = username => {
    this.props.onAddCollab(username)
    this.setState({ searchText: null })
  }

  removeCollab = ind => {
    this.props.onRemoveCollab(this.state.collaborators[ind].username)
    this.setState({
      collaborators: this.state.collaborators.splice(ind, 1)
    })
  }

  close = () => {
    this.setState({
      searchText: null
    })
    this.props.onRequestClose()
  }

  render () {
    const { project } = this.props

    const collabsList = this.state.collaborators ? this.state.collaborators.map((collaborator, i) => {
      const { image, username } = collaborator
      return (
        <div key={`${project.name}-Collab-${i}`} className={classes['container']}>
          <ListItem
            leftAvatar={
              <Avatar
                icon={<PersonIcon />}
                src={(image && image.url) ? image.url : null}
              />
            }
            rightIcon={
              <RemoveIcon
                color={Colors.red500}
                hoverColor={Colors.red800}
                onClick={this.removeCollab.bind(this, i)}
              />
            }
            primaryText={username}
            secondaryText='Read, Write'
          />
        </div>
      )
    }) : null

    const actions = [
      <FlatButton
        label='Close'
        secondary
        onClick={this.props.onRequestClose}
        onTouchTap={this.props.onRequestClose}
      />
    ]

    const matchingUsernames = this.state.matchingUsers
      ? this.state.matchingUsers.map(account =>
          account.username ? account.username : account
        )
      : []

    return (
      <Dialog
        {...this.props}
        title='Sharing'
        actions={actions}
        modal={false}
        bodyClassName='SharingDialog-Content'
        titleClassName='SharingDialog-Content-Title'
        contentClassName='SharingDialog'
      >
        {
          this.props.error
          ? (
            <div className='SharingDialog-Error'>
              <span>{this.props.error}</span>
            </div>
          )
          : null
        }
        {
          collabsList
            ? (
            <List>
              {collabsList}
            </List>
            )
            : (
            <div className='SharingDialog-No-Collabs'>
              <span>No current collaborators</span>
            </div>
            )
        }
        <div className='SharingDialog-AutoComplete-Container'>
          <AutoComplete
            className='SharingDialog-Autocomplete'
            hintText='Search users to add'
            floatingLabelText='Search users to add'
            fullWidth
            searchText={this.state.searchText}
            dataSource={matchingUsernames}
            onUpdateInput={this.searchAccounts}
            onNewRequest={this.selectNewCollab}
          />
        </div>
      </Dialog>
    )
  }
}
