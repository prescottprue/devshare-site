import React, { PropTypes, Component } from 'react'
import Tabs from '../../components/Tabs'
import Views from '../../components/Views'
import classes from './Pane.scss'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions as TabActions } from '../../modules/tabs'
import { helpers } from 'redux-devshare'
const { toJS } = helpers

@connect(
  // Map state to props
  ({devshare, tabs}, { params: { username, projectname } }) => ({
    tabs: toJS(tabs)[`${username}/${projectname}`] || {}
  }),
  // Map dispatch to props
  (dispatch) =>
    bindActionCreators(TabActions, dispatch)
)
export default class Pane extends Component {

  static propTypes = {
    tabs: PropTypes.object,
    project: PropTypes.object,
    openTab: PropTypes.func.isRequired,
    closeTab: PropTypes.func.isRequired
  }

  render () {
    const {
      project,
      closeTab,
      openTab,
      tabs: { list, currentIndex }
    } = this.props
    console.debug('tabs in props:', list, currentIndex)
    return (
      <div className={classes['container']}>
        <Tabs
          list={list}
          currentIndex={currentIndex}
          onClose={(i) => closeTab(project, i)}
          onSelect={(i) => openTab(project, i)}
        />
        <Views
          views={list}
          currentIndex={currentIndex}
          project={project}
          workspace={this.workspace}
        />
      </div>
    )
  }

}
