import React, {Component, PropTypes} from 'react'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'
import classes from './NewProjectDialog.scss'

export default class NewProjectDialog extends Component {

  static propTypes = {
    open: PropTypes.bool,
    onCreateClick: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func.isRequired
  }

  state = { open: this.props.open || false }

  componentWillReceiveProps (nextProps) {
    if (nextProps.open) {
      this.setState({
        open: true
      })
      setTimeout(() => {
        if (this.refs && this.refs.projectNameField) {
          this.refs.projectNameField.focus()
        }
      }, 500)
    }
  }

  handleInputChange = (name, e) => {
    e.preventDefault()
    this.setState({
      [name]: e.target.value,
      error: null
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    if (!this.state.name) {
      return this.setState({
        error: 'Name is required'
      })
    }
    if (this.props.onCreateClick) {
      this.props.onCreateClick(this.state.name)
      this.close()
    }
  }

  close = () => {
    this.setState({
      open: false
    })
    if (this.props.onRequestClose) {
      this.props.onRequestClose()
    }
  }

  render () {
    const actions = [
      <FlatButton
        label='Cancel'
        secondary
        onClick={this.close}
      />,
      <FlatButton
        label='Create'
        primary
        onClick={this.handleSubmit}
      />
    ]
    return (
      <Dialog
        title='New Project'
        modal={false}
        actions={actions}
        open={this.state.open}
        onRequestClose={this.close}
        contentClassName={classes['container']}>
        <div className={classes['inputs']}>
          <TextField
            hintText='exampleProject'
            floatingLabelText='Project Name'
            ref='projectNameField'
            onChange={(e) => this.handleInputChange('name', e)}
            errorText={this.state.error || null}
          />
        </div>
      </Dialog>
    )
  }
}
