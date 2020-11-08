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
    async createSheet(title = 'test', sheetTitle = 'Sheet1', rightToLeft = false, emailAddress) {
      try {
        const opt = {
            fields: 'spreadsheetId',
            resource: {
                properties: {
                    title,
                },
                sheets: [
                    {
                        properties: {
                            title: sheetTitle,
                            rightToLeft
                        }
                    }
                ]
            }
        };
        const res = await this.gsapi.spreadsheets.create(opt);
        const fileId = res.data.spreadsheetId;
        await this.gdapi.permissions.create({
            resource: {
                type: 'user',
                role: 'writer',
                emailAddress,
            },
            fileId: fileId,
            fields: 'id',
        });
        return fileId;
    } catch (error) {
        throw error;
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
            throw error;
        }
    }
}

module.exports = GoogleSheetsAPI;
