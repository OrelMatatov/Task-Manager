const sqlite3 = require('sqlite3').verbose();

// Connect to DB
const db = new sqlite3.Database('./taskManager.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.log(err.message);
});



db.serialize(() => {

    //Create tables 
    db.run(`CREATE TABLE IF NOT EXISTS  users (
        user_id INTEGER PRIMARY KEY,
        email TEXT NOT NULL,
        password TEXT NOT NULL)
    `, (err) => {
        if(err) return console.log(err.message);
        console.log("Users table created successfully");
    });

    db.run(`
        CREATE TABLE IF NOT EXISTS status (
            status_id INTEGER PRIMARY KEY AUTOINCREMENT,  
            status_name VARCHAR(255) NOT NULL        
        )
    `, (err) => {
        if(err) return console.log(err.message);
        console.log("Status table created successfully");
    })

    db.run(`
        CREATE TABLE IF NOT EXISTS tasks(
            task_id INTEGER PRIMARY KEY,
            user_id INTEGER NOT NULL,
            status_id INTEGER NOT NULL,
            task_name TEXT NOT NULL,
            due_date DATE NOT NULL,
            FOREIGN KEY (status_id) REFERENCES status(id),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `, (err) => {
        if(err) return console.log(err.message);
        console.log("tasks table created successfully");
    })

    //Insert data to db
    db.run(`
        INSERT INTO status (status_name) VALUES 
            ('Pending'), 
            ('In Progress'), 
            ('Completed')
        `, (err) => {
            if(err) return console.error('Error inserting values into status table:', err.message);
            console.log('Values inserted successfully into status table');
        })

})

