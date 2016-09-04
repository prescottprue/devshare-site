import React, { Component, PropTypes } from 'react'
// import Workspace from '../components/Workspace/Workspace'

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
    children: PropTypes.object
  }

  selectProject = proj => {
    if (proj.owner) {
      this.context.router.push(`/${proj.owner.username}/${proj.name}`)
    }
  }

  render () {
    const { project } = this.props
    console.log('project', project)
    return (
      <div className='Project'>
        {/* <Workspace
          project={this.props.project}
          showButtons
          onProjectSelect={this.selectProject}
        /> */}
        Project
      </div>
    )
  }
}
