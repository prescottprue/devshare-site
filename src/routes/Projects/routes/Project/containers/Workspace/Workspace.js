import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { firebaseConnect, pathToJS } from 'react-redux-firebase'

// Containers
import SideBar from '../SideBar/SideBar'
import Pane from '../Pane/Pane'

// Components
import WorkspacePopover from '../../components/WorkspacePopover/WorkspacePopover'
import classes from './Workspace.scss'

@firebaseConnect()
@connect(
  ({ firebase }) => ({
    account: pathToJS(firebase, 'profile')
  })
)
export default class Workspace extends Component {

  state = {
    inputVisible: false,
    settingsOpen: false,
    sharingOpen: false,
    addPath: '',
    addType: 'file',
    popoverOpen: false,
    debouncedFiles: null,
    filesLoading: false
  }

  static propTypes = {
    firebase: PropTypes.shape({
      project: PropTypes.func,
      users: PropTypes.func
    }),
    params: PropTypes.shape({
      username: PropTypes.string,
      projectname: PropTypes.string
    }),
    account: PropTypes.object,
    project: PropTypes.object,
    projects: PropTypes.object,
    tabs: PropTypes.object,
    showProjects: PropTypes.bool,
    hideName: PropTypes.bool,
    showButtons: PropTypes.bool,
    navigateToTab: PropTypes.func,
    closeTab: PropTypes.func,
    addCollaborator: PropTypes.func,
    removeCollaborator: PropTypes.func,
    onSettingsClick: PropTypes.func.isRequired,
    onSharingClick: PropTypes.func.isRequired,
    onProjectSelect: PropTypes.func
  }

  toggleSettingsModal = () =>
    this.setState({
      settingsOpen: !this.state.settingsOpen
    })

  toggleSharingModal = () =>
    this.setState({
      sharingOpen: !this.state.sharingOpen
    })

  showPopover = (addType, addPath) =>
    this.setState({
      addPath,
      addType,
      popoverOpen: true
    })

  handlePopoverClose = () =>
    this.setState({
      popoverOpen: false
    })

  saveSettings = data =>
    this.toggleSettingsModal()

  addCollaborator = username =>
    this.props.addCollaborator(this.props.project, username)

  removeCollaborator = username =>
    this.props.removeCollaborator(this.props.project, username)

  // TODO: expose search in redux-firebase
  searchUsers = (q, cb) => {
    this.props.firebase.users()
      .search(q)
      .then(usersList =>
        cb(null, usersList),
        error => cb(error)
      )
  }

  addFile = (path, content) => {
    console.log('add file called:', path, content)
    this.props.firebase
      .project(this.props.project)
      .fileSystem
      .addFile(path, content)
      // .then(file => event({ category: 'Files', action: 'File added' }))
      .catch(error => {
        console.error('error adding file', error)
        this.error = error.toString
      })
  }

  addFolder = path =>
    this.props.firebase
      .project(this.props.project)
      .fileSystem
      .addFolder(path.replace('/', ''))
      // .then(file => event({ category: 'Files', action: 'Folder added' }))

  addEntity = (type, path, content) =>
    type === 'folder'
      ? this.addFolder(path)
      : this.addFile(path, content)

  deleteFile = (path) =>
    this.props.firebase
      .project(this.props.project)
      .fileSystem
      .file(path)
      .remove()
      // .then(file => event({ category: 'Files', action: 'File deleted' }))

  render () {
    const {
      project,
      params,
      onSettingsClick,
      onSharingClick,
      account,
      projects
    } = this.props

    return (
      <div className={classes.container} ref='workspace'>
        <WorkspacePopover
          workspaceElement={this.refs.workspace}
          initialPath={this.state.addPath}
          type={this.state.addType}
          onSubmit={this.addEntity}
          open={this.state.popoverOpen}
          onClose={this.handlePopoverClose}
        />
        <SideBar
          project={project}
          projects={projects}
          account={account}
          onSettingsClick={onSettingsClick}
          onSharingClick={onSharingClick}
          showProjects={!!account && !!account.username}
          onShowPopover={this.showPopover}
        />
        <Pane
          project={project}
          params={params}
        />
      </div>
    )
  }
}
