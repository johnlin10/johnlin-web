/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

const { onRequest } = require('firebase-functions/v2/https')
// const logger = require('firebase-functions/logger')
const admin = require('firebase-admin')

admin.initializeApp()

exports.redirect = onRequest(async (request, response) => {
  try {
    const shortCode = request.path.split('/')[2]

    if (!shortCode) {
      response.status(404).send('Short code not found')
      return
    }

    const docRef = admin.firestore().collection('shortUrls').doc(shortCode)
    const doc = await docRef.get()

    if (!doc.exists) {
      response.status(404).send('Short code not found')
      return
    }

    const { originalUrl } = doc.data()
    response.set('Access-Control-Allow-Origin', '*')
    response.redirect(301, originalUrl)
  } catch (error) {
    console.error('Redirect error', error)
    response.status(500).send('Internal server error')
  }
})
