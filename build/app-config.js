const _debug = require('debug') // eslint-disable-line no-underscore-dangle
const { version } = require('../package.json')
const fs = require('fs')
const path = require('path')
const firebaseEnvironemnts = require('../config/firebaseEnvironments')

const debug = _debug('app:build:config')
const {
  TRAVIS_BRANCH,
  TRAVIS_PULL_REQUEST,
  SENTRY_DSN,
  GA_TRACKINGID,
  INT_FIREBASE_WEBAPIKEY,
  STAGE_FIREBASE_WEBAPIKEY,
  PROD_FIREBASE_WEBAPIKEY,
} = process.env

const isProduction = (TRAVIS_BRANCH === 'prod')
const isStage = (TRAVIS_BRANCH === 'stage')

const createConfigFile = (cb) => {
  let env = 'int'

  if (TRAVIS_PULL_REQUEST === false) {
    if (isProduction) {
      env = 'prod'
    }
    if (isStage) {
      env = 'stage'
    }
  }

  let firebase = {}
  if (isProduction) {
    firebase = firebaseEnvironemnts.prod
    firebase.apiKey = PROD_FIREBASE_WEBAPIKEY
  } else if (isStage) {
    firebase = firebaseEnvironemnts.stage
    firebase.apiKey = STAGE_FIREBASE_WEBAPIKEY
  } else {
    firebase = firebaseEnvironemnts.int
    firebase.apiKey = INT_FIREBASE_WEBAPIKEY
  }

  const outputPath = path.join(__dirname, '..', 'src/config.js')
  const fileString = `export const firebase = ${JSON.stringify(firebase, null, 2)}\n` +
    `\nexport const version = ${JSON.stringify(version)}\n`+
    `\nexport const env = ${JSON.stringify(env)}\n`+
    `\nexport const sentryDsn = ${JSON.stringify(SENTRY_DSN || '')}\n`+
    `\nexport const gaTrackingId = ${JSON.stringify(GA_TRACKINGID || '')}\n`+
    `\nexport default { firebase, version, env, sentryDsn, gaTrackingId }\n`

  fs.writeFile(outputPath, fileString, 'utf8', (err) => { // eslint-disable-line consistent-return
    if (err) {
      return debug('Error writing config file:', err)
    }
    if (cb) {
      cb()
    }
  })
}

(function () {
  createConfigFile(() => {
    debug('Config file successfully written to src/config.js')
  })
})()
