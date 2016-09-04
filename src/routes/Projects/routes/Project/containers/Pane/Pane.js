import React, { PropTypes, Component } from 'react'
import Tabs from '../../components/Tabs'
import Views from '../../components/Views'
import { toArray } from 'lodash'
import classes from './Pane.scss'

// redux-devsharev3
import { connect } from 'react-redux'
import { devshare, helpers } from 'redux-devshare'
const { pathToJS, dataToJS } = helpers

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
    account: pathToJS(devshare, 'profile'),
    tabs: { list: [{title: 'blank', name: 'asdf', file: { path: 'index.js' }}] }
  })
)
export default class Pane extends Component {

  static propTypes = {
    tabs: PropTypes.object,
    project: PropTypes.object,
    onTabSelect: PropTypes.func,
    onTabClose: PropTypes.func,
    vimEnabled: PropTypes.bool
  }

  closeTab = (ind) => {
    this.props.onTabClose(ind)
  }

  selectTab = (ind) => {
    this.props.onTabSelect(ind)
  }

  render () {
    const { tabs: { list, currentIndex } } = this.props
    return (
      <div className={classes['container']}>
        <Tabs
          list={list}
          currentIndex={currentIndex}
          onClose={this.closeTab}
          onSelect={this.selectTab}
        />
        <Views
          views={list}
          currentIndex={currentIndex}
          project={this.props.project}
          workspace={this.workspace}
        />
      </div>
    )
  }

}
