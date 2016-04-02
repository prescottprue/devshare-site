import { find, map } from 'lodash'
import React, {Component, PropTypes} from 'react'
import FlatButton from 'material-ui/lib/flat-button'
import Dialog from 'material-ui/lib/dialog'
import List from 'material-ui/lib/lists/list'
import ListItem from 'material-ui/lib/lists/list-item'
import AutoComplete from 'material-ui/lib/auto-complete'
import Avatar from 'material-ui/lib/avatar'
import PersonIcon from 'material-ui/lib/svg-icons/social/person'
import RemoveIcon from 'material-ui/lib/svg-icons/content/remove-circle'
import Colors from 'material-ui/lib/styles/colors'
import './SharingDialog.scss'

const user = {
  image: {
    url: null
  }
}

export default class SharingDialog extends Component {
  constructor (props){
    super(props)
  }

  state = {
    open: this.props.open || false,
    matchingUsers: [],
    collaborators: this.props.project.collaborators || [],
    error: null
  }

  static propTypes = {
    project: PropTypes.object.isRequired,
    open: PropTypes.bool,
    onUserSearch: PropTypes.func.isRequired,
    onSave: PropTypes.func,
    onRemoveCollab: PropTypes.func,
    onAddCollab: PropTypes.func
  }

  componentWillReceiveProps (nextProps) {
    this.state.collaborators = nextProps.project.collaborators || []
  }

  searchAccounts = q => {
    this.props.onUserSearch(q, (error, matchingUsers) => {
      if (error) return this.setState({ error  })
      if (!matchingUsers || !matchingUsers.length) return this.setState({ matchingUsers: [] })
      this.setState({ matchingUsers })
    })
  }

  selectNewCollab = username => {
    const { collaborators } = this.props.project
    if (this.props.onAddCollab) this.props.onAddCollab(username)
    this.setState({
      searchText: null,
      collaborators
    })
  }

  removeCollab = ind => {
    const user = this.state.collaborators[ind]
    if(this.props.onRemoveCollab){
      this.props.onRemoveCollab(user.username)
      this.setState({
        collaborators: this.state.collaborators.splice(ind, 1)
      })
    }
  }

  close = () => {
    this.setState({
      searchText: null,
      open: false
    })
  }

  render () {
    console.log('this.state.collaborators:', this.state.collaborators)
    let collabsList = this.state.collaborators ? this.state.collaborators.map((collaborator, i) => {
      const { image, username } = collaborator
      return (
        <div key={`${this.props.project.name}-Collab-${i}`}>
          <ListItem
            leftAvatar={
              <Avatar
                icon={ <PersonIcon /> }
                src={ (image && image.url) ? image.url : null }
              />
            }
            rightIcon={
              <RemoveIcon
                color={ Colors.red500 }
                hoverColor={ Colors.red800 }
                onClick={ this.removeCollab.bind(this, i) }
              />
            }
            primaryText={ username }
            secondaryText="Read, Write"
          />
        </div>
      )
    }) : null

    const actions = [
      <FlatButton
        label="Close"
        secondary={ true }
        onTouchTap={ this.close }
      />
    ]

    const matchingUsernames = this.state.matchingUsers
      ? this.state.matchingUsers.map(account =>
          account.username ? account.username : account
        )
      : []

    return (
      <Dialog
        title='Sharing'
        actions={ actions }
        modal={ false }
        open={ this.state.open }
        onRequestClose={ this.close }
        bodyClassName='SharingDialog-Content'
        titleClassName='SharingDialog-Content-Title'
        contentClassName='SharingDialog'
      >
        {
          this.state.collaborators
            ? <List>
                { collabsList }
              </List>
            : <div className="SharingDialog-No-Collabs">
                <span>No current collaborators</span>
              </div>
        }
        <div className="SharingDialog-AutoComplete-Container">
          <AutoComplete
            className="SharingDialog-Autocomplete"
            hintText="Search users to add"
            floatingLabelText="Search users to add"
            fullWidth={ true }
            searchText={ this.state.searchText }
            dataSource={ matchingUsernames }
            onUpdateInput={ this.searchAccounts }
            onNewRequest={ this.selectNewCollab }
          />
        </div>
      </Dialog>
    )
  }
}
