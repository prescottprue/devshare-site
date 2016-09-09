import {
  TAB_OPEN,
  TAB_CLOSE,
  SET_ACTIVE_TAB
} from './constants'

import { fromJS } from 'immutable'

const initialState = fromJS({})

export default function tabs (state = initialState, { type, project, payload, title, index }) {
  switch (type) {
    case TAB_OPEN:
      if (!project || !project.name) {
        console.error('Project name needed to open tab')
        return
      }
      const projectKey = project.owner
        ? `${project.owner}/${project.name}`
        : project.name

      const stateWithTab = state.getIn([`${project.owner}/${project.name}`, 'list'])
        ? [
          ...state.getIn([projectKey, 'list']).toJS(),
            { title, file: payload }
        ]
        : [
            { title, file: payload }
        ]
      return state.setIn(
        [ projectKey, 'list' ],
        fromJS(stateWithTab)
      )
    case TAB_CLOSE:
      return state.deleteIn([`${project.owner}/${project.name}`, 'list', index])
    case SET_ACTIVE_TAB:
      console.log('setting active tab:', `${project.owner}/${project.name}`)
      const listLength = state.getIn([`${project.owner}/${project.name}`, 'list']).toJS().length
      console.log('tojs in active tab:', listLength)
      return state.setIn([`${project.owner}/${project.name}`, 'currentIndex'], index || listLength - 1)
    default:
      return state
  }
}
