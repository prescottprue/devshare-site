import {
  merge, toArray,
  findIndex, isFunction,
  each, isEqual, debounce,
  last
} from 'lodash'
import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as TabActions from '../../actions/tabs'
import Rebase from 're-base'
import Devshare from 'devshare'

// Components
import SideBar from '../../components/SideBar/SideBar'
import ProjectSettingsDialog from '../../components/ProjectSettingsDialog/ProjectSettingsDialog'
import SharingDialog from '../SharingDialog/SharingDialog'
import ContextMenu from '../../components/ContextMenu/ContextMenu'
import Pane from '../../components/Pane/Pane'
import WorkspacePopover from '../../components/WorkspacePopover/WorkspacePopover'
import { event } from '../../helpers/ga'
import './Workspace.scss'

const fileEntityBlackList = ['.DS_Store', 'node_modules']

class Workspace extends Component {
  constructor () {
    super()
    this.debounceStateChange = debounce(this.debounceStateChange, 1000)
  }

  state = {
    inputVisible: false,
    settingsOpen: false,
    sharingOpen: false,
    files: [],
    addPath: '',
    addType: 'file',
    popoverOpen: false,
    debouncedFiles: null,
    filesLoading: false,
    vimEnabled: false,
    contextMenu: {
      path: '',
      open: false,
      position: {
        x: 0,
        y: 0
      }
    }
  }

  static propTypes = {
    project: PropTypes.object,
    tabs: PropTypes.object,
    showProjects: PropTypes.bool,
    hideName: PropTypes.bool,
    showButtons: PropTypes.bool,
    projects: PropTypes.array,
    navigateToTab: PropTypes.func.isRequired,
    openTab: PropTypes.func.isRequired,
    closeTab: PropTypes.func.isRequired,
    addCollaborator: PropTypes.func.isRequired,
    removeCollaborator: PropTypes.func.isRequired,
    onProjectSelect: PropTypes.func.isRequired
  }

  componentDidMount () {
    this.fetchProjectFiles(this.props.project)
  }

  componentWillReceiveProps (nextProps) {
    // Rebind files if props change (new project selected)
    this.fetchProjectFiles(nextProps.project)
  }

  componentWillUnmount () {
    // Unbind files list from Firebase
    if (this.fb && isFunction(this.fb.removeBinding)) {
      this.fb.removeBinding(this.ref)
    }
  }

  componentWillUpdate (nextProps, nextState) {
    if (!isEqual(this.state.files, nextState.files)) this.debounceStateChange()
  }

  fetchProjectFiles = project => {
    const { name, owner } = project
    if (!name) return new Error('project name required to fetch projects')
    if (this.ref && this.ref.endpoint === name) return
    if (this.ref && this.ref.endpoint !== name) this.fb.reset()
    const fbUrl = project ? Devshare.project(owner.username, name).fileSystem.firebaseUrl() : null
    // Move to parent ref
    this.fb = Rebase.createClass(fbUrl.replace(`/${name}`, ''))
    // Bind to files list on firebase
    this.ref = this.fb.bindToState(name, {
      context: this,
      state: 'files',
      asArray: true
    })
    this.debounceStateChange()
  }

  debounceStateChange = () =>
    this.setState({
      debouncedFiles: this.state.files
    })

  toggleSettingsModal = () =>
    this.setState({
      settingsOpen: !this.state.settingsOpen
    })

  toggleSharingModal = () =>
    this.setState({
      sharingOpen: !this.state.sharingOpen
    })

  selectTab = index =>
    this.props.navigateToTab({ project: this.props.project, index })

  closeTab = index =>
    this.props.closeTab({ project: this.props.project, index })

  toggleVim = vimState =>
    this.setState({
      vimEnabled: !this.state.vimEnabled
    })

  showContextMenu = (path, position) =>
    this.setState({
      contextMenu: {
        open: true,
        path: path,
        position
      }
    })

  dismissContextMenu = (path, position) =>
    this.setState({
      contextMenu: {
        open: false,
        path: '',
        position
      }
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

  searchUsers = (q, cb) =>
    Devshare.users()
      .search(q)
      .then(usersList =>
        cb(null, usersList),
        error => cb(error)
      )

  handleDownloadClick = () => {
    console.log('handle download click')
    Devshare.project(this.props.project)
      .fileSystem
      .download()
      .then(res => console.log('download successful:', res))
      .catch(error => {
        console.error('error downloading files', error)
        this.error = error.toString()
      })
  }

  addFile = (path, content) =>
    Devshare.project(this.props.project)
      .fileSystem
      .addFile(path.replace('/', ''), content)
      .then(file => event({ category: 'Files', action: 'File added' }))
      .catch(error => {
        console.error('error adding file', error)
        this.error = error.toString
      })

  addFolder = path =>
    Devshare.project(this.props.project)
      .fileSystem
      .addFolder(path.replace('/', ''))
      .then(file => event({ category: 'Files', action: 'Folder added' }))
      .catch(error => this.error = error.toString)

  addEntity = (type, path, content) =>
    type === 'folder'
      ? this.addFolder(path)
      : this.addFile(path, content)

  deleteFile = (path) =>
    Devshare.project(this.props.project)
      .fileSystem
      .file(path)
      .remove()
      .then(file => event({ category: 'Files', action: 'File deleted' }))
      .catch(error => this.error = error.toString)

  openFile = (file) => {
    const { project, tabs } = this.props
    const tabData = {
      project,
      title: file.name || file.path.split('/')[file.path.split('/').length - 1],
      type: 'file',
      file
    }
    // TODO: Search by matching path instead of tab title
    // Search for already matching title
    const matchingInd = findIndex(tabs.list, {title: tabData.title})
    // Only open tab if file is not already open
    if (matchingInd === -1) {
      this.props.openTab(tabData)
      // Select last tab
      const newInd = tabs.list ? tabs.list.length - 1 : 0
      return this.props.navigateToTab({ project, index: newInd })
    }
    this.props.navigateToTab({
      project,
      index: matchingInd
    })
  }

  readAndSaveFileEntry = (entry) => {
    let parent = this
    // TODO: Use bind instead of parent var
    function readAndSaveFile (file, path) {
      let reader = new FileReader()
      reader.onloadend = function (e) {
        parent.addFile(path, this.result)
      }
      reader.readAsText(file)
    }
    if (entry.webkitRelativePath) return readAndSaveFile(entry, entry.webkitRelativePath)
    entry.file(file => readAndSaveFile(file, entry.fullPath))
  }

  readAndSaveFolderEntry = (entry) => {
    this.addFolder(entry.fullPath)
    let reader = entry.createReader()
    reader.readEntries(folder => {
      if (folder.length > 1) this.handleEntries(folder)
    })
  }

  handleEntries = (entries) => {
    if (entries.isFile) {
      this.readAndSaveFileEntry(entries)
    } else if (entries.isDirectory) {
      this.readAndSaveFolderEntry(entries)
    }
    each(entries, (entry) => {
      if (fileEntityBlackList.indexOf(last(entry.fullPath.split('/'))) !== -1) {
        return void 0
      }
      if (entry.isFile) {
        this.readAndSaveFileEntry(entry)
      } else if (entry.isDirectory) {
        this.readAndSaveFolderEntry(entry)
      }
    })
  }

  onFilesDrop = (e) => {
    e.preventDefault()
    this.setState({
      filesLoading: true
    })
    each(e.dataTransfer.items, item => {
      let entry = item.webkitGetAsEntry()
      this.handleEntries(entry)
    })
    this.setState({
      filesLoading: false
    })
  }

  onFilesAdd = (e) => {
    e.preventDefault()
    each(e.target.files, item => {
      if (fileEntityBlackList.indexOf(last(item.webkitRelativePath.split('/'))) !== -1) {
        return void 0
      }
      this.readAndSaveFileEntry(item)
    })
  }

  toggleDialog = (name) => {
    let newState = {}
    newState[`${name}Open`] = !newState[`${name}Open`] || true
    this.setState(newState)
  }

  closeDialog = (name) => {
    console.log('close menu called:', name)
    let newState = {}
    newState[`${name}Open`] = false
    this.setState(newState)
  }
  // TODO: Finish a popup for clone settings
  //
  // cloneProject = p => {
  //   Devshare.project(this.props.project)
  //     .clone()
  //     .then()
  //     .catch()
  // }

  render () {
    const { name, owner } = this.props.project
    return (
      <div className='Workspace' ref='workspace'>
        <WorkspacePopover
          workspaceElement={this.refs.workspace}
          initialPath={this.state.addPath}
          type={this.state.addType}
          onSubmit={this.addEntity}
          open={this.state.popoverOpen}
          onClose={this.handlePopoverClose}
        />
        <SideBar
          projects={this.props.projects}
          showProjects={this.props.showProjects}
          project={this.props.project}
          onProjectSelect={this.props.onProjectSelect}
          showButtons={this.props.showButtons}
          files={this.state.debouncedFiles}
          hideName={this.props.hideName}
          onFileClick={this.openFile}
          onSettingsClick={this.toggleSettingsModal}
          onSharingClick={this.toggleSharingModal}
          onAddFileClick={this.showPopover.bind(this, 'file')}
          onAddFolderClick={this.showPopover.bind(this, 'folder')}
          onFilesDrop={this.onFilesDrop}
          onFilesAdd={this.onFilesAdd}
          onDownloadClick={this.handleDownloadClick}
          onRightClick={this.showContextMenu}
          filesLoading={this.state.filesLoading}
          onCloneClick={this.showPopover.bind(this, 'clone')}
        />
        <Pane
          tabs={this.props.tabs}
          onTabSelect={this.selectTab}
          onTabClose={this.closeTab}
          project={this.props.project}
          vimEnabled={this.state.vimEnabled}
        />
        {
          this.state.settingsOpen
            ? (
            <ProjectSettingsDialog
              project={this.props.project}
              open={this.state.settingsOpen}
              onSave={this.saveSettings}
              onVimToggle={this.toggleVim}
              vimEnabled={this.state.vimEnabled}
              onRequestClose={this.closeDialog.bind(this, 'settings')}
            />
            )
            : null
        }
        {
          this.state.sharingOpen
          ? (
            <SharingDialog
              projectKey={`${owner.username}/${name}`}
              open={this.state.sharingOpen}
              onUserSearch={this.searchUsers}
              onSave={this.saveSettings}
              onAddCollab={this.addCollaborator}
              onRemoveCollab={this.removeCollaborator}
              onRequestClose={this.closeDialog.bind(this, 'sharing')}
            />
          )
           : null
        }
        {
          this.state.contextMenu.open
          ? (
            <ContextMenu
              path={this.state.contextMenu.path}
              onAddFileClick={this.showPopover.bind(this, 'file')}
              onAddFolderClick={this.showPopover.bind(this, 'folder')}
              onFileDelete={this.deleteFile}
              position={this.state.contextMenu.position}
              dismiss={this.dismissContextMenu}
            />
          ) : null
        }
      </div>
    )
  }
}

// Place state of redux store into props of component
function mapStateToProps (state) {
  const pathname = decodeURIComponent(state.router.location.pathname)
  const username = pathname.split('/')[1]
  const projectname = pathname.split('/')[2]
  const owner = username || 'anon'
  const key = `${owner}/${projectname}`
  const tabs = (state.tabs && state.tabs[key]) ? state.tabs[key] : {}
  const projects = (state.entities && state.entities.projects) ? toArray(state.entities.projects) : []
  return {
    projects,
    tabs,
    account: state.account,
    router: state.router
  }
}

const CombinedActions = merge(TabActions)

// Place action methods into props
const mapDispatchToProps = dispatch =>
  bindActionCreators(CombinedActions, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Workspace)
