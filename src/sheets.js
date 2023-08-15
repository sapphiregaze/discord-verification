const { google } = require('googleapis');

const service = google.sheets('v4');
const credentials = require('../credentials.json');

const { spreadsheetId } = require('../config.json');

// configure auth client
const authClient = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key.replace(/\\n/g, '\n'),
    ['https://www.googleapis.com/auth/spreadsheets']
);

module.exports.write = async function (username, email, signature) {
    // set authorize token
    const token = await authClient.authorize();
    authClient.setCredentials(token);

    // append values to correct json format
    let values = [
        [username, email, signature],
    ];

    const resources = {
        values,
    };
    
    // append values to the next available line as raw input
    await service.spreadsheets.values.append({
        auth: authClient,
        spreadsheetId: spreadsheetId,
        range: 'A1',
        valueInputOption: 'RAW',
        resource: resources,
    });
};