import React, { PropTypes, Component } from 'react'
import View from '../View'
import classes from './Views.scss'

export default class Views extends Component {

  static propTypes = {
    views: PropTypes.array,
    currentIndex: PropTypes.number,
    project: PropTypes.object.isRequired,
    vimEnabled: PropTypes.bool
  }

  buildViews = () => {
    const currentIndex = this.props.currentIndex || 0
    const { views, project, vimEnabled } = this.props
    return views.map((view, i) => {
      if (i === currentIndex) {
        return (
          <View
            key={`{i}-${view.file.path}`}
            index={i}
            viewData={view}
            project={project}
            visible
            vimEnabled={vimEnabled}
          />
        )
      }
      return (
        <View
          index={i}
          key={i}
          viewData={view}
          project={project}
          visible={false}
          vimEnabled={vimEnabled}
        />
      )
    })
  }

  render () {
    if (!this.props.views) {
      return (
        <div className={classes['view-default']}>
          <span className={classes['view-default-label']}>Click on a file to open</span>
        </div>
      )
    }
    const views = this.buildViews()
    return (
      <div className={classes['container']}>
        {views}
      </div>
    )
  }
}
