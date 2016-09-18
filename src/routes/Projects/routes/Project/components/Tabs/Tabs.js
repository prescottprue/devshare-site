import React, { PropTypes, Component } from 'react'
import Tab from '../Tab/Tab'
import classes from './Tabs.scss'

export default class Tabs extends Component {
  static propTypes = {
    currentIndex: PropTypes.number,
    list: PropTypes.array,
    onSelect: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
  };

  render () {
    const {
      list,
      currentIndex,
      onSelect,
      onClose
    } = this.props

    let tabs = []
    if (list) {
      tabs = list.map((tab, i) => {
        return (
          <Tab
            key={`Tab-${i}`}
            index={i}
            title={tab.title || tab.name || 'unamed file'}
            active={currentIndex === i}
            onSelect={onSelect}
            onClose={onClose}
          />
        )
      })
    }

    return (
      <ul className={classes['container']}>
        {tabs}
      </ul>
    )
  }
}
