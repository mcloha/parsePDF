const GoogleSheetsAPI = require('./GoogleSheetsAPI');
const { exec } = require('child_process');
const { promisify } = require('util');

const execSync = promisify(exec);

const prettifyData = data => {
    const separator = '&$,';

    data = data.replace(/[ ]{2,}_/, '_');
    data = data.replace(/[ ]{2,}-/, '-');
    data = data.replace(/[ ]{7,}/g, separator);
    data = data.replace(/\.[ ]/g, separator);

    const rows = data.split('\r');
    const filtered = rows.filter(row => row.trim().length > 0);
    
    return filtered.map(row => row.replace(/\n/g, '').trim().split(separator));
}

const parse = async () => {
    try {
        const googleSheetsAPI = new GoogleSheetsAPI();
        const spreadSheetId = 'YOUR_SPREAD_SHEET_ID';
        const sheetName = 'SHEET_NAME';

        const pdfFileName = 'FILE_TO_PARSE';
        const { stdout, stderr } = await execSync(`pdftotext -table ${pdfFileName} -`);

        if(stderr) throw stderr;
        
        const googleSheetsData = prettifyData(stdout);

        await googleSheetsAPI.clearSheet(spreadSheetId, sheetName);
        await googleSheetsAPI.writeToSheet(spreadSheetId, sheetName, googleSheetsData);

        console.log('Done.');
    } catch (error) {
        console.error(error.message);
    }
}

parse();