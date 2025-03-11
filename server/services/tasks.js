const sqlite3 = require('sqlite3').verbose();

// Connect to DB
const db = new sqlite3.Database('../db/taskManager.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.log(err.message);
});


const getUserTasks = (userId) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT t.*, s.status_name AS status
            FROM tasks t
            JOIN status s ON t.status_id = s.status_id 
            WHERE user_id = ?
        `
        db.all(query, [userId], (err, tasks) => {
            if(err){
                console.error(`Error retrieving tasks for user_id ${userId}:`, err.message);
                return reject(`Database error: Unable to retrieve tasks for user ${userId}` );
            }
            
            resolve(tasks);
        })
    })
}

const getAllUsersTasks = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT t.*, s.status_name AS status
            FROM tasks t
            JOIN status s ON t.status_id = s.status_id 
        `
        db.all(query, [], (err, allTasks) => {
            if(err){
                console.error(`Error retrieving tasks`, err.message);
                return reject(`Database error: Unable to retrieve tasks of all users` );
            }
            
            resolve(allTasks);
        })
    })
}

const getTaskById = (taskId) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT t.*, s.status_name AS status
            FROM tasks t
            JOIN status s ON t.status_id = s.status_id
            WHERE t.task_id = ?
        `
        db.all(query, [taskId], (err, task) => {
            if(err){
                console.error(`Error retrieving task for task_id ${taskId}:`, err.message);
                return reject(`Database error: Failed to retrieve task with id of ${taskId}` );
            }
            
            resolve(task);
        })
    })
}

const addTask = (user_id, task_name, due_date) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO tasks(user_id, task_name, status_id, due_date) 
            VALUES  (?, ?, ?, ?)
        `
        db.run(query, [user_id, task_name, 1, due_date], (err) => {
            if(err){
                console.error("Error adding task:", err.message);
                return reject(`Database error: Failed to add task for user ${user_id}`);
            }
            resolve({message: "Added task successfully"})
        })
    })
}

const editTask = (task_id, task_name, due_date, status_id) => {
    return new Promise((resolve, reject) => {
        let query = 'UPDATE tasks SET';
        let params = [];

        if(task_name){
            query += ' task_name = ?,';
            params.push(task_name)
        }

        if(due_date){
            query += ' due_date = ?,';
            params.push(due_date);
        }

        if(status_id){
            query += ' status_id = ?,';
            params.push(status_id);
        }

        if (query.endsWith(',')) {
            query = query.slice(0, -1);
        }

        query += ' WHERE task_id = ?';
        params.push(task_id);

        db.run(query, params, (err) => {
            if (err) {
                console.error("Error edit task:", err.message);
                return reject(`Database error: Failed to edit task with id pf ${task_id}`);
            }
            resolve({ message: 'Task updated successfully' });
        });
    })
}

const deleteTask = (taskId) => {
    const query = `DELETE FROM tasks WHERE task_id = ?`
    db.run(query, [taskId], (err) => {
        if(err) {
            console.error("Error adding task:", err.message);
            return reject(`Database error: Failed to delete task with id of ${taskId}`);
        }
        resolve({message: "Task deleted successfully"});
    })
}

module.exports = {getAllUsersTasks, getUserTasks, getTaskById, addTask, editTask, deleteTask}
