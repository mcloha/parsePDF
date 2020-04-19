const keys = require('./credentials.json');
const { google } = require('googleapis');

class GoogleSheetsAPI {
    constructor() {
        this.version = 'v4';
        this.client = new google.auth.JWT(
            keys.client_email,
            null,
            keys.private_key,
            ['https://www.googleapis.com/auth/spreadsheets'],
        );
        this.client.authorize((error, token) => {
            if (error) throw error;
            console.log('Connected');
        });
        this.gsapi = google.sheets({ version: this.version, auth: this.client });
    }

    async writeToSheet(spreadsheetId, sheetName, values) {
        try {
            const opt = { 
                spreadsheetId, 
                range: `${sheetName}!A1`, 
                valueInputOption: 'USER_ENTERED',
                resource: { values } 
            };
            const updated = await this.gsapi.spreadsheets.values.update(opt);
            
            console.log('Spreadsheet updated.', updated);
        } catch (error) {
            throw error;
        }
    }

    async clearSheet(spreadsheetId, sheetName) {
        try {
            const opt = { 
                spreadsheetId, 
                range: `${sheetName}!A:Z`
            };
            await this.gsapi.spreadsheets.values.clear(opt);
        } catch (error) {
            
        }
    }
}

module.exports = GoogleSheetsAPI;