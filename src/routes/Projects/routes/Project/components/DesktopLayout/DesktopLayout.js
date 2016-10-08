import React, { PropTypes } from 'react'
import SideBar from '../../containers/SideBar/SideBar'
import Pane from '../../containers/Pane/Pane'

import classes from './DesktopLayout.scss'

export const DesktopLayout = ({ project, projects, account, onSettingsClick, onSharingClick, onShowPopover }) => (
  <div className={classes.container}>
    <SideBar
      project={project}
      projects={projects}
      onSettingsClick={onSettingsClick}
      onSharingClick={onSharingClick}
      showProjects={!!account && !!account.username}
      onShowPopover={onShowPopover}
    />
    <Pane
      project={project}
    />
  </div>
)

DesktopLayout.propTypes = {
  project: PropTypes.object.isRequired,
  projects: PropTypes.array.isRequired,
  account: PropTypes.object,
  onSettingsClick: PropTypes.func.isRequired,
  onSharingClick: PropTypes.func.isRequired,
  onShowPopover: PropTypes.func.isRequired
}

export default DesktopLayout
