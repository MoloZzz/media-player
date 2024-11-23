const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, 'app.log');

function logEvent(eventName, details = null) {
    const time = new Date().toISOString();
    const logMessage = `[${time}] Event: ${eventName} ${details ? `| Details: ${JSON.stringify(details)}` : ''}\n`;
    fs.appendFile(logFilePath, logMessage, (err) => {
        if (err) console.error('Error writing log:', err);
    });
}

module.exports = logEvent;
