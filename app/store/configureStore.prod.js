import { createStore, applyMiddleware, compose } from 'redux'
import rootReducer from '../reducers'
import thunk from 'redux-thunk'
import { reduxDevshare } from 'redux-devshare'
import { syncHistory } from 'react-router-redux'

export default function configureStore (initialState, history) {
  console.log('prod configure store')
  const reduxRouterMiddleware = syncHistory(history)
  const createStoreWithMiddleware = compose(
    applyMiddleware(thunk, reduxRouterMiddleware),
    reduxDevshare({ userProfile: 'users' })
  )(createStore)
  const store = createStoreWithMiddleware(rootReducer, initialState)

  return store
}
