(function () {
  const exec = require('child_process').exec
  // Upload to version url then to latest url
  deployToFirebase()

  function deployToFirebase (cb) {
    if (process.env.TRAVIS_BRANCH && process.env.TRAVIS_BRANCH !== 'master') {
      console.log('Skipping Firebase Deploy - Branch is not master.')
      if (cb) cb()
    } else {
      console.log('Deploying to Firebase...')
      console.log('Package version:', process.env.npm_package_version)
      exec(`firebase deploy --token ${process.env.FIREBASE_TOKEN}`, (error) => {
        if (error !== null) {
          console.log('error uploading to Firebase url: ')
          console.log(error.toString() || error)
          throw error
        }
        console.log('Successfully deployed to Firebase')
        if (cb) cb()
      })
    }
  }
})()
