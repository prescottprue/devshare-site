var functions = require('firebase-functions');
// var AdmZip = require('adm-zip');
// var gcloud = require('gcloud');
var firebase = require('firebase');
// var _ = require('lodash');
// var Promise = require('es6-promise').Promise
// global.Promise = Promise

exports.createZip = functions.database().path('/requests/{id}').on('write', function(e) {
  if (e.data.child('isCompleted').val()) { return }
  // var Firepad = require('firepad');
  try {
    firebase.initializeApp({
      serviceAccount: './serviceAccount.json',
      databaseURL: "https://pruvit-968.firebaseio.com"
    });
  } catch(err) {}


  return firebase.database()
    .ref('files/prescottprue/diuy/doit:js')
    .once('value')
    .then(fileSnap =>  e.data.ref.update({
        isCompleted: true,
        val: fileSnap.val()
      })
      // Firepad.Headless(fileSnap.ref).getText(text => {
      //   // zip.addFile(child.meta.path, new Buffer(text))
      //   // resolve(text || '')
      //   console.log('text from firepad:', text);
      //   return e.data.ref.update({
      //     isCompleted: true,
      //     text: text
      //   })
      // })
    )
})

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
