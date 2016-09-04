import React, { Component, PropTypes } from 'react'
import Workspace from '../Workspace/Workspace'

import classes from './Project.scss'
import ProjectSettingsDialog from '../../components/ProjectSettingsDialog/ProjectSettingsDialog'
import SharingDialog from '../../components/SharingDialog/SharingDialog'

// redux-devsharev3
import { connect } from 'react-redux'
import { devshare, helpers } from 'redux-devshare'
const { pathToJS, dataToJS } = helpers

@devshare(({ params }) =>
  ([
    `projects/${params.username}/${params.projectname}`
  ])
)
@connect(
  // Map state to props
  ({devshare}, { params }) => ({
    project: dataToJS(devshare, `projects/${params.username}/${params.projectname}`),
    authError: pathToJS(devshare, 'authError'),
    account: pathToJS(devshare, 'profile')
  })
)
export default class Project extends Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  static propTypes = {
    username: PropTypes.string,
    name: PropTypes.string,
    account: PropTypes.object,
    project: PropTypes.object,
    auth: PropTypes.object,
    params: PropTypes.object,
    children: PropTypes.object
  }

  state = { settingsOpen: false, sharingOpen: false, vimEnabled: false }

  selectProject = proj => {
    if (proj.owner) {
      this.context.router.push(`/${proj.owner.username}/${proj.name}`)
    }
  }

  closeDialog = (name) => {
    const newState = {}
    newState[`${name}Open`] = false
    this.setState(newState)
  }

  render () {
    const { project, params } = this.props
    const { settingsOpen, sharingOpen, vimEnabled } = this.state
    console.log('props in project', this.props)
    return (
      <div className={classes['container']}>
        <Workspace project={project} params={params} />
        {
          settingsOpen &&
          (
            <ProjectSettingsDialog
              project={project}
              open={settingsOpen}
              onSave={this.saveSettings}
              onVimToggle={this.toggleVim}
              vimEnabled={vimEnabled}
              onRequestClose={() => { this.closeDialog('settings') }}
            />
          )
        }
        {
          sharingOpen &&
          (
            <SharingDialog
              projectKey={`${project.owner.username}/${name}`}
              open={sharingOpen}
              onUserSearch={this.searchUsers}
              onSave={this.saveSettings}
              onAddCollab={this.addCollaborator}
              onRemoveCollab={this.removeCollaborator}
              onRequestClose={() => { this.closeDialog('sharing') }}
            />
          )
        }
      </div>
    )
  }
}
