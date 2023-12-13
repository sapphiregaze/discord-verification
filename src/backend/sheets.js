const path = require('path');
const { google } = require('googleapis');

const service = google.sheets('v4');
const credentials = require('../../credentials.json');

require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

// configure auth client
const authClient = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key.replace(/\\n/g, '\n'),
    ['https://www.googleapis.com/auth/spreadsheets']
);

module.exports.write = async function (time, username, email, signature) {
    // set authorize token
    const token = await authClient.authorize();
    authClient.setCredentials(token);

    // append values to correct json format
    let values = [
        [time, username, email, signature],
    ];

    const data = {
        values,
    };
    
    // append values to the next available line as raw input
    await service.spreadsheets.values.append({
        auth: authClient,
        spreadsheetId: process.env.SPREADSHEET_ID,
        range: 'A1',
        valueInputOption: 'RAW',
        resource: data,
    });
};