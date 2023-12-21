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

// validate signature with regex
const validateSignature = (signature) => {
    return String(signature)
        .match(
            /^([a-zA-Z]{2,}\s[a-zA-Z]{1,}'?-?[a-zA-Z]{2,}\s?([a-zA-Z]{1,})?)/
        );
}

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

    // check if the file exists before attempting to read it
    if (!fs.existsSync(absolutePath)) {
        console.error(`File not found: ${absolutePath}`);
        return [];
    }

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
    return date.toLocaleString('en-US');
}

async function createTableIfNotExists(db) {
    return new Promise((resolve, reject) => {
        db.run(`CREATE TABLE IF NOT EXISTS users (
            user_id TEXT PRIMARY KEY,
            username TEXT,
            pfp_url TEXT,
            email TEXT,
            signature TEXT,
            member_since TEXT
        );`, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

async function insertOrUpdateUser(db, user) {
    return new Promise((resolve, reject) => {
        db.run(`INSERT OR REPLACE INTO users (user_id, username, pfp_url, email, signature, member_since) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [user.userId, user.username, user.pfp, user.email, user.signature, user.memberSince],
            function (err) {
                if (err) {
                    reject(err);
                } else {
                    console.log(`A row has been inserted with rowid ${this.lastID}`);
                    resolve();
                }
            });
    });
}

async function writeUserData(user) {
    let db = new sqlite3.Database('../../users.db', async (err) => {
        if (err) {
            return console.error(err.message);
        }

        try {
            await createTableIfNotExists(db);
            await insertOrUpdateUser(db, user);
        } catch (error) {
            console.error(error.message);
        } finally {
            db.close();
        }
    });
}

// query data from the users table within the database
async function getUserData() {
    return new Promise((resolve, reject) => {
        let usersArray = [];
        let db = new sqlite3.Database('../../users.db', sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                reject(err);
            } else {
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

const getUserById = (user_id) => {
    return new Promise((resolve, reject) => {
        let db = new sqlite3.Database('../../users.db', sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                reject(err);
            } else {
                db.get(`SELECT * FROM users 
                    WHERE user_id = ?`, [user_id], (err, row) => {
                    db.close((closeErr) => {
                        if (closeErr) {
                            reject(closeErr);
                        } else {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(row);
                            }
                        }
                    });
                });
            }
        });
    });
};



module.exports = {
    validateEmail,
    validateSignature,
    updateUser,
    readJSON,
    formatISODate,
    writeUserData,
    getUserData,
    getUserById,
};