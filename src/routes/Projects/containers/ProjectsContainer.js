import React, { Component, PropTypes } from 'react'
import { map } from 'lodash'

// Components
import ProjectTile from '../components/ProjectTile/ProjectTile'
import NewProjectTile from '../components/NewProjectTile/NewProjectTile'
import NewProjectDialog from '../components/NewProjectDialog/NewProjectDialog'
import SharingDialog from '../components/SharingDialog/SharingDialog'

import classes from './ProjectsContainer.scss'

// redux/devshare
import { connect } from 'react-redux'
import { devshare, helpers } from 'redux-devshare'
const { pathToJS, dataToJS } = helpers

// Decorators
@devshare(
  ({ params }) =>
    ([
      `projects/${params.username}`
    ])
)
@connect(
  ({ devshare }, { params }) => ({
    projects: map(dataToJS(devshare, `projects/${params.username}`), (project, key) =>
      Object.assign({}, project, { key })),
    account: pathToJS(devshare, 'profile')
  })
)
export class Projects extends Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  static propTypes = {
    account: PropTypes.object,
    projects: PropTypes.array,
    devshare: PropTypes.object,
    params: PropTypes.object,
    history: PropTypes.object
  }

  state = {
    addCollabModal: false,
    newProjectModal: false
  }

  toggleModal = name => {
    let newState = {}
    newState[`${name}Modal`] = !this.state[`${name}Modal`] || false
    this.setState(newState)
  }

  newSubmit = name => {
    this.props.devshare.addProject(this.props.account.username, name)
    this.toggleModal('newProject')
  }

  openProject = project =>
    this.context.router.push(`/${project.owner.username}/${project.name}`)

  collaboratorClick = collaborator =>
    this.props.history.pushState(null, `/${collaborator.username}`)

  collabClick = user =>
    this.context.router.push(`/${user.username}`)

  addCollabClick = currentProject => {
    this.setState({ currentProject })
    this.toggleModal('addCollab')
  }

  deleteProject = project =>
    this.props.devshare.deleteProject(project.owner.username, project.name)

  render () {
    const { projects, account, params: { username } } = this.props
    const { newProjectModal, addCollabModal, currentProject } = this.state

    const projectsList = projects ? projects.map((project, i) =>
      (
      <ProjectTile
        key={`${project.name}-Collab-${i}`}
        project={project}
        onCollabClick={this.collabClick}
        onAddCollabClick={this.addCollabClick.bind(this, project)}
        onSelect={this.openProject}
        onDelete={this.deleteProject}
      />
      )
    ) : <span>No projects yet</span>

    // If username doesn't match route then hide add project tile
    if (account && account.username === username) {
      projectsList.unshift((
        <NewProjectTile
          key='Project-New'
          onClick={this.toggleModal.bind(this, 'newProject')}
        />
      ))
    }

    return (
      <div className={classes['container']}>
        <div className={classes['tiles']}>
          {projectsList}
        </div>
        {
          newProjectModal
          ? (
            <NewProjectDialog
              open={newProjectModal}
              onCreateClick={this.newSubmit}
            />
          ) : null
        }
        {
          (currentProject && addCollabModal)
          ? (
            <SharingDialog
              projectKey={`${currentProject.owner.username}/${currentProject.name}`}
              open={addCollabModal}
              onRequestClose={this.toggleModal.bind(this, 'addCollab')}
            />
          ) : null
        }
      </div>
    )
  }
}
export default Projects
