import React, { Component, PropTypes } from 'react'
import { findIndex, each, last, toArray } from 'lodash'

import SideBar from '../SideBar/SideBar'
import Pane from '../Pane/Pane'

// Components
// import ContextMenu from '../../components/ContextMenu/ContextMenu'
import WorkspacePopover from '../../components/WorkspacePopover/WorkspacePopover'
import classes from './Workspace.scss'

const fileEntityBlackList = ['.DS_Store', 'node_modules']

// redux-devsharev3
import { connect } from 'react-redux'
import { devshare, helpers } from 'redux-devshare'
const { pathToJS, dataToJS } = helpers

// TODO: Load files list
// TODO: Wire tab actions
@devshare(({ params }) =>
  ([
    `projects/${params.username}`,
    `projects/${params.username}/${params.projectname}`
  ])
)
@connect(
  // Map state to props
  ({devshare}, { params }) => ({
    projects: toArray(dataToJS(devshare, `projects/${params.username}`)),
    project: dataToJS(devshare, `projects/${params.username}/${params.projectname}`),
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
    devshare: PropTypes.shape({
      project: PropTypes.func,
      users: PropTypes.func
    }),
    params: PropTypes.shape({
      username: PropTypes.string,
      projectname: PropTypes.string
    }),
    project: PropTypes.object,
    tabs: PropTypes.object,
    showProjects: PropTypes.bool,
    hideName: PropTypes.bool,
    showButtons: PropTypes.bool,
    projects: PropTypes.array,
    navigateToTab: PropTypes.func,
    openTab: PropTypes.func,
    closeTab: PropTypes.func,
    addCollaborator: PropTypes.func,
    removeCollaborator: PropTypes.func,
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

  // TODO: expose search in redux-devshare
  searchUsers = (q, cb) => {
    this.props.devshare.users()
      .search(q)
      .then(usersList =>
        cb(null, usersList),
        error => cb(error)
      )
  }

  // TODO: Expose file system in redux-devshare
  handleDownloadClick = () => {
    console.log('handle download click')
    this.props.devshare
      .project(this.props.project)
      .fileSystem
      .download()
      .then(res => console.log('download successful:', res))
      .catch(error => {
        console.error('error downloading files', error)
        this.error = error.toString()
      })
  }

  addFile = (path, content) =>
    this.props.devshare
      .project(this.props.project)
      .fileSystem
      .addFile(path.replace('/', ''), content)
      // .then(file => event({ category: 'Files', action: 'File added' }))
      .catch(error => {
        console.error('error adding file', error)
        this.error = error.toString
      })

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
      .then(file => event({ category: 'Files', action: 'File deleted' }))

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

  // TODO: Finish a popup for clone settings
  // cloneProject = p => {
  //   Devshare.project(this.props.project)
  //     .clone()
  //     .then()
  //     .catch()
  // }

  render () {
    const { project, params } = this.props
    if (!project) return (<div>Loading...</div>)
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
        <SideBar project={project} />
        <Pane
          project={project}
          params={params}
          vimEnabled={this.state.vimEnabled}
        />
        {/* {
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
        } */}
      </div>
    )
  }
}
