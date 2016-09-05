import React, { PropTypes, Component } from 'react'
import { isArray } from 'lodash'

import TreeView from '../TreeView'
import ContextMenu from '../../components/ContextMenu/ContextMenu'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import AddIcon from 'material-ui/svg-icons/content/add-circle'
import SettingsIcon from 'material-ui/svg-icons/action/settings'
import GroupIcon from 'material-ui/svg-icons/social/group'
import CopyIcon from 'material-ui/svg-icons/content/content-copy'
import ArchiveIcon from 'material-ui/svg-icons/content/archive'

const classnames = require('classnames')
import classes from './SideBar.scss'

// Icon styles
const iconButtonStyle = { width: '50px', height: '50px', padding: '0px' }
const iconStyle = { width: '100%', height: '100%' }
const tooltipPosition = 'top-center'

export default class SideBar extends Component {

  static propTypes = {
    projects: PropTypes.array,
    project: PropTypes.object.isRequired,
    files: PropTypes.array,
    showProjects: PropTypes.bool,
    onSettingsClick: PropTypes.func.isRequired,
    onSharingClick: PropTypes.func.isRequired,
    navigateToTab: PropTypes.func,
    closeTab: PropTypes.func,
    onShowPopover: PropTypes.func
  }

  state = {
    filesOver: false,
    contextMenu: {
      path: '',
      open: false,
      position: {
        x: 0,
        y: 0
      }
    }
  }

  componentDidMount () {
    this.refs.fileInput.setAttribute('webkitdirectory', '')
  }

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

  selectProject = (e, i, name) => {
    // if (this.props && this.props.onProjectSelect) {
    //   let proj = find(this.props.projects, { name })
    //   // this.props.onProjectSelect(proj, i)
    // }
  }

  handleFileUploadClick = (e) => {
    this.refs.fileInput.click()
  }

  handleFileUpload = (e) => {
    // this.props.onFilesAdd(e)
  }

  handleFileDrag = (e) => {
    e.preventDefault()
    this.setState({
      filesOver: true
    })
  }

  handleFileDrop = (e) => {
    // this.props.onFilesDrop(e)
    this.setState({ filesOver: false })
  }

  handleFileDragLeave = (e) => {
    this.setState({ filesOver: false })
  }

  handleRightClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('right click:', { x: e.clientX, y: e.clientY })
    this.showContextMenu(null, { x: e.clientX, y: e.clientY })
  }

  addFileClick = (f) => {
    console.log('add file clicked', f)
  }

  addFolderClick = (f) => {
    console.log('add folder clicked', f)
  }

  downloadClick = () => {
    console.log('enable download functionality')
  }

  fileClick = () => {

  }

  rightClick = () => {

  }

  cloneClick = () => {

  }

  showPopover = (addType, addPath) =>
    this.setState({
      addPath,
      addType,
      popoverOpen: true
    })

  render () {
    const {
      files,
      project,
      projects,
      onSettingsClick,
      onSharingClick,
      showProjects
    } = this.props

    const projectsMenu = isArray(projects) && projects.length > 0
      ? projects.map((project, i) =>
        <MenuItem
          key={`Project-${i}`}
          label={project.name}
          value={project.name}
          primaryText={project.name}
        />
        )
      : null

    return (
      <div className={classnames(classes['container'], { 'filehover': this.state.filesOver })}
        onDragOver={this.handleFileDrag}
        onDragLeave={this.handleFileDragLeave}
        onDrop={this.handleFileDrop}
        onContextMenu={this.handleRightClick}
      >
        <div className={classes['dropzone']}>
        {
          (projectsMenu && showProjects)
            ? (
            <SelectField
              style={{width: '80%', marginLeft: '10%'}}
              labelStyle={{fontSize: '1.5rem', fontWeight: '300', textOverflow: 'ellipsis'}}
              autoWidth={false}
              value={project.name}
              children={projectsMenu}
              onChange={this.selectProject}
            />
            ) : null
        }
          <TreeView
            fileStructure={files}
            onFileClick={this.fileClick}
            onRightClick={this.rightClick}
            project={project}
          />
          <input
            type='file'
            ref='fileInput'
            style={{display: 'none'}}
            onChange={this.handleFileUpload}
            multiple
          />
          <div className={classes['buttons']}>
            <IconButton
              style={iconButtonStyle}
              iconStyle={iconStyle}
              onClick={this.cloneClick}
              tooltip='Clone'
              tooltipPosition={tooltipPosition}
              touch
              disabled>
              <CopyIcon />
            </IconButton>
            <IconButton
              style={iconButtonStyle}
              iconStyle={iconStyle}
              onClick={this.downloadClick}
              tooltip='Download'
              tooltipPosition={tooltipPosition}
              touch
              disabled={!files || files.length < 1}>
              <ArchiveIcon />
            </IconButton>
          </div>
          <div className={classes['buttons']}>
            <IconMenu
              iconButtonElement={
                <IconButton
                  style={iconButtonStyle}
                  iconStyle={iconStyle}
                  tooltip='Add'
                  tooltipPosition={tooltipPosition}
                  touch >
                  <AddIcon />
                </IconButton>
            }>
              <MenuItem primaryText='Upload files' onClick={this.handleFileUploadClick} />
              <MenuItem primaryText='Add file' onClick={this.addFileClick} />
              <MenuItem primaryText='Add folder' onClick={this.addFolderClick} />
            </IconMenu>
            <IconButton
              style={iconButtonStyle}
              iconStyle={iconStyle}
              onClick={onSharingClick}
              tooltip='Sharing'
              tooltipPosition={tooltipPosition}
              touch >
              <GroupIcon />
            </IconButton>
            <IconButton
              style={iconButtonStyle}
              iconStyle={iconStyle}
              onClick={onSettingsClick}
              tooltip='Settings'
              tooltipPosition={tooltipPosition}
              touch >
              <SettingsIcon />
            </IconButton>
          </div>
          {
            this.state.contextMenu.open
            ? (
              <ContextMenu
                path={this.state.contextMenu.path}
                onAddFileClick={() => { this.props.showPopover('file') }}
                onAddFolderClick={() => { this.props.showPopover('folder') }}
                onFileDelete={this.deleteFile}
                position={this.state.contextMenu.position}
                dismiss={this.dismissContextMenu}
              />
            ) : null
          }
        </div>
      </div>
    )
  }
}
