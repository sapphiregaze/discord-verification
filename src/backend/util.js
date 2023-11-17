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

module.exports = {
    validateEmail,
    updateUser,
};