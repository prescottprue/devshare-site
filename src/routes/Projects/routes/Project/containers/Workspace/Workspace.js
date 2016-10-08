import React, { Component, PropTypes } from 'react'

// Containers
import SideBar from '../SideBar/SideBar'
import Pane from '../Pane/Pane'

// Components
import Media from 'react-media'
import SwipeableViews from 'react-swipeable-views'
import Paper from 'material-ui/Paper'
import FolderIcon from 'material-ui/svg-icons/file/folder-open'
import EditorIcon from 'material-ui/svg-icons/editor/text-fields'
import SettingsIcon from 'material-ui/svg-icons/action/settings'
import { Tabs, Tab } from 'material-ui/Tabs'

import WorkspacePopover from '../../components/WorkspacePopover/WorkspacePopover'
import classes from './Workspace.scss'

// redux/devshare
import { connect } from 'react-redux'
import { devshare, helpers } from 'redux-devshare'
const { pathToJS } = helpers

@devshare()
@connect(
  // Map state to props
  ({devshare}, { params }) => ({
    authError: pathToJS(devshare, 'authError'),
    account: pathToJS(devshare, 'profile')
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
    filesLoading: false,
    slideIndex: 0
  }

  static propTypes = {
    devshare: PropTypes.shape({
      project: PropTypes.func,
      users: PropTypes.func
    }),
    params: PropTypes.shape({
      username: PropTypes.string,
      projectname: PropTypes.string
    }),
    account: PropTypes.object,
    project: PropTypes.object,
    tabs: PropTypes.object,
    showProjects: PropTypes.bool,
    hideName: PropTypes.bool,
    showButtons: PropTypes.bool,
    projects: PropTypes.array,
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

  handleChange = (value) => {
    this.setState({
      slideIndex: value
    })
  }

  saveSettings = data =>
    this.toggleSettingsModal()

  addCollaborator = username =>
    this.props.addCollaborator(this.props.project, username)

  removeCollaborator = username =>
    this.props.removeCollaborator(this.props.project, username)

  // TODO: expose search in redux-devshare
  searchUsers = (q, cb) => {
    this.props.devshare.users()
      .search(q)
      .then(usersList =>
        cb(null, usersList),
        error => cb(error)
      )
  }

  addFile = (path, content) => {
    console.log('add file called:', path, content)
    this.props.devshare
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
    this.props.devshare
      .project(this.props.project)
      .fileSystem
      .addFolder(path.replace('/', ''))
      // .then(file => event({ category: 'Files', action: 'Folder added' }))

  addEntity = (type, path, content) =>
    type === 'folder'
      ? this.addFolder(path)
      : this.addFile(path, content)

  deleteFile = (path) =>
    this.props.devshare
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

    const desktopLayout = (
      <div className={classes.container}>
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

    const mobileLayout = (
      <div className={classes['mobile']}>
        <SwipeableViews
          index={this.state.slideIndex}
          onChangeIndex={this.handleChange}
        >
          <div className={classes.tab}>
            <SideBar
              project={project}
              projects={projects}
              account={account}
              onSettingsClick={onSettingsClick}
              onSharingClick={onSharingClick}
              showProjects={!!account && !!account.username}
              onShowPopover={this.showPopover}
            />
          </div>
          <div className={classes.tab}>
            <Pane
              project={project}
              params={params}
            />
          </div>
          <div className={classes.tab}>
            Settings Page
          </div>
        </SwipeableViews>
        <Paper zDepth={1} className={classes.bottom}>
          <Tabs onChange={this.handleChange} value={this.state.slideIndex}>
            <Tab
              label='Files'
              value={0}
              icon={<FolderIcon />}
            />
            <Tab
              label='Editor'
              value={1}
              icon={<EditorIcon />}
            />
            <Tab
              label='Settings'
              value={2}
              icon={<SettingsIcon />}
            />
          </Tabs>
        </Paper>
      </div>
    )

    return (
      <div className={classes['container']} ref='workspace'>
        <WorkspacePopover
          workspaceElement={this.refs.workspace}
          initialPath={this.state.addPath}
          type={this.state.addType}
          onSubmit={this.addEntity}
          open={this.state.popoverOpen}
          onClose={this.handlePopoverClose}
        />
        <Media query={{minWidth: '736px'}}>
          {
            matches => matches
            ? desktopLayout
            : mobileLayout
          }
        </Media>
      </div>
    )
  }
}
