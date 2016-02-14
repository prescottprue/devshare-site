import { map, filter, merge } from 'lodash';
import React, { PropTypes, Component } from 'react';
import TreeFolder from '../TreeFolder';
import TreeFile from '../TreeFile';
import Dropzone from 'react-dropzone';
import './TreeView.scss';
const hideCurrentUser = true; //Display current user in file's connected users
class TreeView extends Component {
  constructor() {
    super();
    this.inputKey = null;
  }

  state = {
    contextMenu: {
      display: 'none',
      top: '0px',
      left: '0px'
    },
    selectedPath: ''
  };

  static propTypes = {
    fileStructure: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      path: PropTypes.string,
    })),
    onFileClick: PropTypes.func,
    onFolderClick: PropTypes.func,
    onAddFileClick: PropTypes.func,
    onAddFolderClick: PropTypes.func,
    projectName: PropTypes.string,
    onFilesDrop: PropTypes.func,
    onFileDelete: PropTypes.func
  };

  handleNewClick = (type) => {
    if (type === 'file') {
      this.props.onAddFileClick(this.getParentOfPath(this.state.selectedPath));
    }
    if (type === 'folder') {
      this.props.onAddFolderClick(this.getParentOfPath(this.state.selectedPath));
    }
  };

  handleRightClick = (e) => {
    e.preventDefault();
    let path = this.getPathOfTarget(e.target);
    this.setState({
      contextMenu: {
        display: 'block',
        top: e.clientY,
        left: e.clientX
      },
      selectedPath: path
    });
    window.addEventListener('click', this.handleWindowClick);
    return false;
  };

  handleWindowClick = () => {
    this.setState({
      contextMenu: {
        display: 'none'
      }
    });
    window.removeEventListener('click', this.handleWindowClick);
  };

  getPathOfTarget = (el) => {
    let i = 0;
    while(el.tagName !== 'LI' && i < 5) {
      el = el.parentNode;
      i++;
    }
    let path = el.getAttribute('data-path');
    if (!path || path.split('/').length < 1) {
      return '/'
    }
    const type = el.getAttribute('data-reactid').split('$child-')[1].split('-')[0].toLowerCase();
    const lastIndex = path.lastIndexOf('/');
    if (lastIndex < 0 && type === 'folder') {
      return `${path}/`;
    }
    return path;
  };

  getParentOfPath = path => {
    return path.substring(0, path.lastIndexOf('/') + 1) || '/';
  };

  handleDeleteClick = (e) => {
    e.preventDefault();
    this.props.onFileDelete(this.state.selectedPath);
  };

  handleEntryClick = (path) => {
    this.setState({
      selectedPath: path
    });
  };

  render() {
    let structure = this.props.fileStructure.map((entry, i) => {
        if (!entry.meta) {
          let firstChildPath = entry[Object.keys(entry)[0]].meta.path;
          let childPathSplit = firstChildPath.split('/');
          entry.meta = {
            entityType: 'folder',
            name: entry.key,
            path: childPathSplit.slice(0, -1).join('/')
          }
        }
      if (entry.meta && (entry.meta.entityType === 'folder')){
        let children = merge({}, entry);
        delete children.key; delete children.meta;
        return (
          <TreeFolder
            key={ `child-Folder-${i}-${entry.meta.name}` }
            index={ i }
            data={ entry.meta }
            isCollapsed={ entry.isCollapsed }
            children={ children }
            onFileClick={ this.props.onFileClick }
          />
        );
      }
      let mappedUsers = entry.users ? map(entry.users, (user, key) => {
        user.username = key;
        return user;
      }) : null;
      // //Remove current user from file's users array
      if(hideCurrentUser && this.props.account && this.props.account.username){
        mappedUsers = mappedUsers ? filter(mappedUsers, (user) => {
          return (user.username !== this.props.account.username);
        }) : null;
      }
      return (
        <TreeFile
          key={ `child-File-${i}-${entry.meta.name || entry.meta.path.split('/')[0]}` }
          index={ i }
          data={ entry.meta }
          active={ entry.active }
          users={ mappedUsers }
          onClick={ this.props.onFileClick }
        />
      );
    });

    var noFiles;
    if (structure.length < 1) {
      noFiles = (
        <li className="TreeView-None" key="NotFound-1">
          <div>
            <strong>Right click</strong><br/>
              OR <br/>
            <strong>Drop files</strong><br/>
              to get started <br/>
          </div>
        </li>
      )
    } else {
      noFiles = null;
    }

    var contextMenuStyle = {
      display: this.state.contextMenu.display,
      top: this.state.contextMenu.top,
      left: this.state.contextMenu.left
    }

    return (
      <div className={ this.state.filesOver ? "TreeView TreeView--FileHover" : "TreeView"} onContextMenu={ this.handleRightClick }>
        <div className="TreeView-Dropzone" onDragOver={ this.handleFileDrag } onDragLeave={ this.handleFileDragLeave } onDrop={ this.handleFileDrop }>
          <div className="TreeView-Container">
            <ol className="TreeView-Structure">
              { noFiles }
              { structure }
            </ol>
            <ul style={ contextMenuStyle } className="TreeView-ContextMenu">
              <li onClick={ this.handleNewClick.bind(this, 'file') }>Add new file</li>
              <li onClick={ this.handleNewClick.bind(this, 'folder') }>Add new folder</li>
              <li onClick={ this.handleDeleteClick }>Delete</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default TreeView;
