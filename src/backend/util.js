const fs = require('fs');
const path = require('path');

// validate email with regex
const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

// update user data
function updateUser(users, userId, code, time) {
    const userData = users.get(userId);
    users.set(userId, { 
        ...userData, 
        verification: { 
            code: code, 
            attempts: 1, 
            time: time,
        },
    });
}

// get content of logs
function readJSON(filePath) {
    const absolutePath = path.isAbsolute(filePath) 
        ? filePath 
        : path.join(__dirname, filePath);

    const arrayJSON = [];
    const content = fs.readFileSync(absolutePath, 'utf8').trim().split('\n');

    content.forEach((line) => {
        try {
            const jsonObject = JSON.parse(line);
            arrayJSON.push(jsonObject);
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    });
  
    return arrayJSON;  
}

// format ISO 8601 date string into readable string
function formatISODate(isoDate) {
    const date = new Date(isoDate);
    const options = { hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };

    return date.toLocaleString('en-US', options);
}

function writeUserData(user) {
    const userData = JSON.stringify(user);
    try {
        fs.appendFileSync('../../users.json', userData + '\n');
    } catch (error) {
        console.error('Error writing to file:', error);
    }
}

module.exports = {
    validateEmail,
    updateUser,
    readJSON,
    formatISODate,
    writeUserData,
};