const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

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

// write user data to sqlite database
function writeUserData(user) {
    let db = new sqlite3.Database('../../users.db', (err) => {
        if (err) {
            return console.error(err.message);
        } else {
            console.log('Connected to users database');
            // create users table if it doesn't exist
            db.run(`CREATE TABLE IF NOT EXISTS users (
                user_id TEXT PRIMARY KEY,
                username TEXT,
                pfp_url TEXT,
                email TEXT,
                signature TEXT,
                member_since TEXT
            );`);

            // insert user into the users table, replace if user_id already exists in table
            db.run(`INSERT OR REPLACE INTO users (user_id, username, pfp_url, email, signature, member_since) 
                VALUES (?, ?, ?, ?, ?, ?)`,
                [user.userId, user.username, user.pfp, user.email, user.signature, user.memberSince],
                (err) => {
                    if (err) {
                        return console.error(err.message);
                    }
                    console.log(`A row has been inserted with rowid ${this.lastID}`);
                });
        }
        db.close();
    });
}

async function getUserData() {
    return new Promise((resolve, reject) => {
        let usersArray = [];
        let db = new sqlite3.Database('../../users.db', sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                reject(err);
            } else {
                console.log('Connected to users database');

                db.each(`SELECT * FROM users`, [],
                    (err, row) => {
                        if (err) {
                            reject(err);
                        }
                        usersArray.push(row);
                    },
                    (err) => {
                        if (err) {
                            reject(err);
                        }
                        resolve(usersArray);
                    }
                );
            }
            db.close();
        });
    });
}


module.exports = {
    validateEmail,
    updateUser,
    readJSON,
    formatISODate,
    writeUserData,
    getUserData,
};