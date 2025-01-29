const admin = require('firebase-admin')
const { onRequest } = require('firebase-functions/v2/https')

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
