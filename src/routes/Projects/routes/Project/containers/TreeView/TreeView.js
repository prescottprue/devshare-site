import React, { PropTypes, Component } from 'react'
import { omit } from 'lodash'

import TreeFolder from '../../components/TreeFolder'
import TreeFile from '../../components/TreeFile'
import CircularProgress from 'material-ui/CircularProgress'
import classes from './TreeView.scss'

export default class TreeView extends Component {

  static propTypes = {
    fileStructure: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      path: PropTypes.string
    })),
    onFileClick: PropTypes.func,
    onFolderClick: PropTypes.func,
    project: PropTypes.object,
    loading: PropTypes.bool,
    onRightClick: PropTypes.func
  }

  showContextMenu = (path, position) =>
    this.setState({
      contextMenu: {
        open: true,
        path: path,
        position
      }
    })

  dismissContextMenu = (path, position) =>
    this.setState({
      contextMenu: {
        open: false,
        path: '',
        position
      }
    })

  getStructure = () => {
    if (!this.props.fileStructure || !this.props.fileStructure.length) return null
    return this.props.fileStructure.map((entry, i) => {
      // no metadata
      if (!entry.meta) {
        const firstChildPath = entry[Object.keys(entry)[0]].meta.path
        const childPathSplit = firstChildPath.split('/')
        entry.meta = {
          entityType: 'folder',
          name: entry.key,
          path: childPathSplit.slice(0, -1).join('/')
        }
      }
      // Folder
      if (entry.meta && (entry.meta.entityType === 'folder')) {
        const children = Object.assign({}, omit(entry, ['key', 'meta']))
        return (
          <TreeFolder
            key={`child-Folder-${i}-${entry.meta.name}`}
            index={i}
            data={entry.meta}
            isCollapsed={entry.isCollapsed}
            children={children}
            onFileClick={this.props.onFileClick}
            onRightClick={this.showContextMenu}
          />
        )
      }
      // File
      return (
        <TreeFile
          key={`child-File-${i}-${entry.meta.name || entry.meta.path.split('/')[0]}`}
          index={i}
          data={entry.meta}
          active={entry.active}
          onClick={this.props.onFileClick}
          onRightClick={this.showContextMenu}
          users={entry.users}
        />
      )
    })
  }

  render () {
    let loading = false
    if (this.props.fileStructure === null || this.props.loading) {
      loading = true
    }
    const structure = this.getStructure()
    return (
      <div className={classes['container']}>
        <div className={classes['wrapper']}>
          {
            (structure && !this.props.loading)
            ? (
              <ol className={classes['structure']}>
                {structure}
              </ol>
            )
            : null
          }
          {
            (!structure && !loading)
            ? (
              <div className={classes['none']} key='NotFound-1'>
                <div className={classes['none-desktop']}>
                  <span><strong>Right click</strong></span>
                  <span className=''>OR</span>
                  <strong>Drop files</strong>
                  <span>to get started</span>
                </div>
                <div className={classes['none-mobile']}>
                  <span>Touch the Plus to get started</span>
                </div>
              </div>
            )
            : null
          }
          {
            loading
            ? (
              <div
                className={classes['loader']}
                style={loading ? {display: 'block'} : {display: 'none'}}>
                <CircularProgress size={0.75} />
              </div>
            )
            : null
          }
        </div>
      </div>
    )
  }
}
