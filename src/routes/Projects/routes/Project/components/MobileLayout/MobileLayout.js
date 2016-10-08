import React, { Component, PropTypes } from 'react'
import SideBar from '../../containers/SideBar/SideBar'
import Pane from '../../containers/Pane/Pane'
import { Tabs, Tab } from 'material-ui/Tabs'
import SwipeableViews from 'react-swipeable-views'
import Paper from 'material-ui/Paper'
import FolderIcon from 'material-ui/svg-icons/file/folder-open'
import EditorIcon from 'material-ui/svg-icons/editor/text-fields'
import SettingsIcon from 'material-ui/svg-icons/action/settings'

import classes from './MobileLayout.scss'

export default class MobileLayout extends Component {
  static propTypes = {
    project: PropTypes.object.isRequired,
    projects: PropTypes.array.isRequired,
    account: PropTypes.object,
    onSettingsClick: PropTypes.func.isRequired,
    onSharingClick: PropTypes.func.isRequired,
    onShowPopover: PropTypes.func.isRequired
  }

  state = {
    slideIndex: 0
  }

  handleChange = (value) => {
    this.setState({
      slideIndex: value
    })
  }

  render() {
    const {
      project,
      projects,
      account,
      onSettingsClick,
      onSharingClick,
      onShowPopover
    } = this.props

    return (
      <div className={classes['container']}>
        <SwipeableViews
          index={this.state.slideIndex}
          onChangeIndex={this.handleChange}
        >
          <div className={classes.tab}>
            <SideBar
              project={project}
              projects={projects}
              account={account}
              onSettingsClick={onSettingsClick}
              onSharingClick={onSharingClick}
              showProjects={!!account && !!account.username}
              onShowPopover={onShowPopover}
            />
          </div>
          <div className={classes.tab}>
            <Pane
              project={project}
            />
          </div>
          <div className={classes.tab}>
            Settings Page
          </div>
        </SwipeableViews>
        <Paper zDepth={1} className={classes.bottom}>
          <Tabs onChange={this.handleChange} value={this.state.slideIndex}>
            <Tab
              label='Files'
              value={0}
              icon={<FolderIcon />}
            />
            <Tab
              label='Editor'
              value={1}
              icon={<EditorIcon />}
            />
            <Tab
              label='Settings'
              value={2}
              icon={<SettingsIcon />}
            />
          </Tabs>
        </Paper>
      </div>
    )
  }
}
