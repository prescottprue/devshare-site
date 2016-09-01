import { combineReducers } from 'redux'
import { routeReducer } from 'react-router-redux'
import tabs from './tabs'
import { reducer as devshare } from 'redux-devshare'

const rootReducer = combineReducers({
  tabs,
  devshare,
  router: routeReducer
})

export default rootReducer
