import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { devshare } from 'redux-devshare'
import { toArray } from 'lodash'
import { firebaseConnect, dataToJS, isLoaded } from 'react-redux-firebase'
import LoadingSpinner from 'components/LoadingSpinner'
import SharingDialog from 'components/SharingDialog'
import Workspace from '../Workspace/Workspace'
import SettingsDialog from '../../components/SettingsDialog/SettingsDialog'
import classes from './Project.scss'

@devshare()
@firebaseConnect(
  // Get paths from firebase
  ({ params: { username, projectname } }) => ([
    `projects/${username}`,
    `projects/${username}/${projectname}`,
    // TODO: Use population instead of loading whole usernames list
    // `projects/${params.username}#populate=collaborators:users`,
    'usernames'
  ])
)
@connect(
  // Map state to props
  ({ firebase }, { params }) => {
    const project = dataToJS(firebase, `projects/${params.username}/${params.projectname}`)
    // TODO: Replace this with population
    if (project && project.collaborators && dataToJS(firebase, 'usernames')) {
      project.collaborators = project.collaborators.map(id => ({
        username: dataToJS(firebase, 'usernames')[id]
      }))
    }
    return {
      projects: toArray(dataToJS(firebase, `projects/${params.username}`)),
      project
    }
  }
)
export default class Project extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  static propTypes = {
    account: PropTypes.object,
    projects: PropTypes.array,
    project: PropTypes.object,
    auth: PropTypes.object,
    params: PropTypes.object.isRequired,
    children: PropTypes.object,
    firebase: PropTypes.object.isRequired,
    devshare: PropTypes.shape({
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
    this.props.devshare
      .project(this.props.project)
      .addCollaborator(username)

  removeCollaborator = username =>
    this.props.devshare
      .project(this.props.project)
      .removeCollaborator(username)

  toggleDialog = (name) => {
    const newState = {}
    newState[`${name}Open`] = !this.state[`${name}Open`]
    this.setState(newState)
  }

  render () {
    const { projects, project, params, devshare } = this.props
    const { settingsOpen, sharingOpen, vimEnabled } = this.state

    if (!isLoaded(project)) {
      return <LoadingSpinner />
    }

    return (
      <div className={classes.container} ref='workspace'>
        <Workspace
          project={project}
          projects={projects}
          params={params}
          onSettingsClick={() => this.toggleDialog('settings')}
          onSharingClick={() => this.toggleDialog('sharing')}
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
              onRequestClose={() => this.toggleDialog('settings')}
            />
          )
        }
        {
          sharingOpen &&
          (
            <SharingDialog
              project={project}
              open={sharingOpen}
              searchUsers={devshare.users().search}
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
