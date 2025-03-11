const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();

// Connect to DB
const db = new sqlite3.Database('../db/taskManager.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.log(err.message);
});


const registerUser = (first_name, last_name, email, password) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if(err) return reject(err);
            
            const query = `INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)`;
            db.run(query, [first_name, last_name, email, hashedPassword], (err) => {
                if(err){
                    console.error("Error When trying insert new user", err.message);
                    return reject("Database error: Failed to add user");
                } 
                resolve({message: "User registered successfully"})
            })
        })
    })
}

const loginUser = (email, password) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM users WHERE email = ?`
        db.get(query, [email], (err, user) => {
            if(err){
                console.error("Error checking email existance ", err.message)
                return reject("Database error: Failed to get users info");
            }

            if(!user){
                return resolve("User not found with this email");
            } 

            bcrypt.compare(password, user.password, (err, result) => {
                if(err) return reject("Hashing error: Failed to compare between 2 hashes");
                if(result) 
                    resolve({user: user, message: "Login successful"})
                else
                    resolve("Incorrect password");
            })  
        })
    })
}

//When register we making sure the email is unique
const checkEmailExistance = (email) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM users WHERE email = ?`
        db.get(query, [email], (err, user) => {
            if(err) {
                console.error("Error checking email existance ", err.message)
                return reject("Database error: Failed to check user email existance");
            }
            if(!user) 
                resolve({uniqueEmail: true})
            else
                resolve({uniqueEmail: false})
        })
    })
}

const getAllUsers = () => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM users`
        db.all(query, [], (err, allUsers) => {
            if(err){
                console.error(`Error retrieving users`, err.message);
                return reject("Database error: Failed to retrieve users");
            }
            
            resolve(allUsers);
        })
    })
}


const getUserById = (userId) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT * 
            FROM users
            WHERE user_id = ?
        `
        db.get(query, [userId], (err, user) => {
            if(err){
                console.error("Error trying get a user ", err.message);
                return reject(`Database error: Failed to get user with id of ${userId}`);
            }
            if(!user) return reject("User not found");
            resolve(user)
        })
    })
} 

module.exports = {registerUser, loginUser, checkEmailExistance, getUserById, getAllUsers}