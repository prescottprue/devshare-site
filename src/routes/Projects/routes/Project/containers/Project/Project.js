import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { firebaseConnect, dataToJS, isLoaded } from 'react-redux-firebase'

import CircularProgress from 'material-ui/CircularProgress'
import SharingDialog from 'components/SharingDialog/SharingDialog'
import Workspace from '../Workspace/Workspace'
import SettingsDialog from '../../components/SettingsDialog/SettingsDialog'

import classes from './Project.scss'

@firebaseConnect(
  // Get paths from devshare
  ({ params: { username, projectname } }) =>
    ([
      `projects/${username}`,
      `projects/${username}/${projectname}`
    ])
)
@connect(
  // Map state to props
  ({ firebase }, { params: { username, projectname } }) => ({
    projects: dataToJS(firebase, `projects/${username}`),
    project: dataToJS(firebase, `projects/${username}/${projectname}`)
  })
)
export default class Project extends Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  static propTypes = {
    account: PropTypes.object,
    projects: PropTypes.object,
    project: PropTypes.object,
    auth: PropTypes.object,
    params: PropTypes.object.isRequired,
    children: PropTypes.object,
    firebase: PropTypes.shape({
      project: PropTypes.func.isRequired
    })
  }

  state = {
    settingsOpen: false,
    sharingOpen: false,
    vimEnabled: false
  }

  selectProject = proj => {
    if (proj.owner) {
      this.context.router.push(`/${proj.owner.username}/${proj.name}`)
    }
  }

  addCollaborator = username =>
    this.props.firebase.project(this.props.project).addCollaborator(username)

  removeCollaborator = username =>
    this.props.firebase.project(this.props.project).removeCollaborator(username)

  toggleDialog = (name) => {
    const newState = {}
    newState[`${name}Open`] = !this.state[`${name}Open`]
    this.setState(newState)
  }

  render () {
    const { projects, project, params, firebase } = this.props
    const { settingsOpen, sharingOpen, vimEnabled } = this.state

    if (!isLoaded(project)) {
      return (
        <div className={classes['progress']}>
          <CircularProgress />
        </div>
      )
    }

    return (
      <div className={classes['container']} ref='workspace'>
        <Workspace
          project={project}
          projects={projects}
          params={params}
          onSettingsClick={() => { this.toggleDialog('settings') }}
          onSharingClick={() => { this.toggleDialog('sharing') }}
        />
        {
          settingsOpen &&
          (
            <SettingsDialog
              project={project}
              open={settingsOpen}
              onSave={this.saveSettings}
              onVimToggle={this.toggleVim}
              vimEnabled={vimEnabled}
              onRequestClose={() => { this.toggleDialog('settings') }}
            />
          )
        }
        {
          sharingOpen &&
          (
            <SharingDialog
              project={project}
              open={sharingOpen}
              searchUsers={firebase.users().search}
              onSave={this.saveSettings}
              onAddCollab={this.addCollaborator}
              onRemoveCollab={this.removeCollaborator}
              onRequestClose={() => this.toggleDialog('sharing')}
            />
          )
        }
      </div>
    )
  }
}
