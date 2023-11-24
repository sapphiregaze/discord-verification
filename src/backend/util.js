const fs = require('fs');
const path = require('path');
const readline = require('readline');

// validate email with regex
const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

// update user data
function updateUser(users, userId, time) {
    const userData = users.get(userId);
    users.set(userId, { 
        ...userData, 
        verification: { 
            code: null, 
            attempts: 1, 
            time: time,
        },
    });
}

// get content of logs
function readLogs(filePath) {
    const absolutePath = path.isAbsolute(filePath) 
        ? filePath 
        : path.join(__dirname, filePath);

    const logJSON = [];
    const logContent = fs.readFileSync(absolutePath, 'utf8').trim().split('\n');

    logContent.forEach((line) => {
        try {
            const jsonObject = JSON.parse(line);
            logJSON.push(jsonObject);
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    });
  
    return logJSON;  
}

// format ISO 8601 date string into readable string
function formatISODate(isoDate) {
    const date = new Date(isoDate);
    const options = { hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };

    return date.toLocaleString('en-US', options);
}

module.exports = {
    validateEmail,
    updateUser,
    readLogs,
    formatISODate,
};