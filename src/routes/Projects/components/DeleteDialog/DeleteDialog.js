import React, { Component, PropTypes } from 'react'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'

import classes from './DeleteDialog.scss'

export default class DeleteDialog extends Component {

  state = { open: this.props.open || false }

  static propTypes = {
    name: PropTypes.string.isRequired,
    open: PropTypes.bool,
    onSubmit: PropTypes.func
  }

  componentWillReceiveProps (nextProps) {
    let nextState = {}
    if (nextProps && typeof nextProps.open !== 'undefined') { nextState.open = nextProps.open }
    this.setState(nextState)
  }

  open = () => {
    this.setState({
      open: false
    })
  }

  close = () => {
    this.setState({
      open: false
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    if (this.props.onSubmit) { this.props.onSubmit(name) }
    this.close()
  }

  handleInputChange = (name, e) => {
    e.preventDefault()
    this.setState({
      [name]: e.target.value
    })
  }

  render () {
    const { name } = this.props
    const deleteActions = [
      <FlatButton
        label='Cancel'
        secondary
        onTouchTap={this.close}
      />,
      <FlatButton
        label='Delete'
        primary
        keyboardFocused
        onTouchTap={this.handleSubmit}
        disabled={!this.state.projectname || this.state.projectname !== this.props.name}
      />
    ]
    return (
      <div className={classes['container']}>
        <Dialog
          title={`Delete ${name}`}
          onRequestClose={this.close}
          open={this.state.open || false}
          actions={deleteActions}
          modal={false} >
          <div className={classes['content']}>
            <div className={classes['section']}>
              <h3 className={classes['warning']}>WARNING: </h3>
              <span>This is a permenant action</span>
            </div>
            <div className={classes['question']}>
              <span>Are you sure this is what you want to be doing?</span>
            </div>
            <div className={classes['restatement']}>
              <span>
                You are about to delete your project named
                <span className={classes['restatement-name']}>
                  {name}
                </span>
              </span>
            </div>
            <div className={classes['input-group']}>
              <span>Please type in the name of the project to confirm:</span>
              <TextField
                floatingLabelText='Project Name'
                onChange={(e) => this.handleInputChange('projectname', e)}
              />
            </div>
          </div>
        </Dialog>
      </div>
    )
  }
}
