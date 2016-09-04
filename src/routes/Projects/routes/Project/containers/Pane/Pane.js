import React, { PropTypes, Component } from 'react'
import Tabs from '../../components/Tabs'
import Views from '../../components/Views'

import './Pane.scss'

// redux-devsharev3
import { connect } from 'react-redux'

@connect(
  // Map state to props
  ({tabs}, { params }) => ({
    tabs: { list: [] }
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
      <div className='Pane'>
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
