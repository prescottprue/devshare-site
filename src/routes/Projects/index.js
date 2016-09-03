
export default (store) => ({
  path: ':username',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const Projects = require('./containers/ProjectsContainer').default

      /*  Return getComponent   */
      cb(null, Projects)

    /* Webpack named bundle   */
    }, 'Projects')
  }
})
