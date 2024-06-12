const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const { OAuth2 } = google.auth

const OAUTH_PLAYGROUND = 'https://developers.google.com/oauthplayground'

const oauth2Client = new OAuth2(
    process.env.GMAIL_CLIENTID,
    process.env.GMAIL_CLIENTSECRET,
    OAUTH_PLAYGROUND
)

oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_RFRESHTOKEN
})

const getAccessToken = async () => {
    try {
        const accessTokenResponse = await oauth2Client.getAccessToken()
        return accessTokenResponse.token
    } catch (err) {
        console.error('Failed to create access token :', err)
        throw new Error('Failed to create access token')
    }
}

const createTransporter = async () => {
    const accessToken = await getAccessToken()

    const smtpTransport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.GMAIL_ACC,
            clientId: process.env.GMAIL_CLIENTID,
            clientSecret: process.env.GMAIL_CLIENTSECRET,
            refreshToken: process.env.GMAIL_RFRESHTOKEN,
            accessToken: accessToken,
        },
    })

    return smtpTransport
}

module.exports = createTransporter
