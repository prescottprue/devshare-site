var functions = require('firebase-functions');
// var AdmZip = require('adm-zip');
// var gcloud = require('gcloud');
// var firebase = require('firebase');
// var _ = require('lodash');
// var Promise = require('es6-promise').Promise
// global.Promise = Promise
//
// var jsdom = require('jsdom')
// var doc = jsdom.jsdom('<html><body></body></html>')
// var winow = doc.defaultView
// global.document = doc
// global.window = window
// global.navigator = window.navigator

// // converts the "text" key of messages pushed to /messages to uppercase
exports.upperCaser = functions.database().path('/messages/{id}').on('write', function(event) {
  // prevent infinite loops
  if (event.data.child('uppercased').val()) { return; }

  return event.data.ref.update({
    text: event.data.child('text').val().toUpperCase(),
    uppercased: true
  });
});

// exports.createZip = functions.database().path('/requests/{id}').on('write', function(e) {
//   if (e.data.child('isCompleted').val()) { return }
//   // var Firepad = require('firepad');
//
//   firebase.initalizeApp({
//     apiKey: "AIzaSyBuwR21cO0lMzMr_T-Dl_jG1dsORXZ1fwY",
//      authDomain: "devshare-stg.firebaseapp.com",
//      databaseURL: "https://devshare-stg.firebaseio.com",
//      storageBucket: "devshare-stg.appspot.com"
//   });
//
//   return firebase.database()
//     .ref('files/prescottprue/diuy/doit:js')
//     .once('value')
//     .then(fileSnap =>  e.data.ref.update({
//         isCompleted: true,
//         val: fileSnap.val()
//       })
//       // Firepad.Headless(fileSnap.ref).getText(text => {
//       //   // zip.addFile(child.meta.path, new Buffer(text))
//       //   // resolve(text || '')
//       //   console.log('text from firepad:', text);
//       //   return e.data.ref.update({
//       //     isCompleted: true,
//       //     text: text
//       //   })
//       // })
//     )
// })

// function createZip (directory) {
//   let zip = new AdmZip()
//   let promiseArray = []
//   function handleZip(fbChildren) {
//     _.each(fbChildren, child => {
//       if (!child.meta || child.meta.entityType === 'folder') {
//         delete child.meta
//         return handleZip(child)
//       }
//       if (child.original && !child.history) return zip.file(child.meta.path, child.original)
//       let promise = new Promise(resolve =>
//         Firepad.Headless(fileSystem.file(child.meta.path).firebaseRef()).getText(text => {
//           zip.addFile(child.meta.path, new Buffer(text))
//           resolve(text || '')
//         })
//       )
//       promiseArray.push(promise)
//     })
//   }
//   handleZip(directory)
//
//   return Promise.all(promiseArray).then(() => {
//     // TODO: Delete zip file after download
//     const zipPath = `./zips/${owner}-${projectName}-devShare-export.zip`
//     zip.writeZip(zipPath)
//     res.download(zipPath)
//   })
// }
