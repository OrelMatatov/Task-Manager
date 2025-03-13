const service = require('../services/tasks');

const getUserTasks = async(req, res) => {
    try{
        const userId = req.params.userId;
        const userTasks = await service.getUserTasks(userId);
        return res.json(userTasks)
    } 
    catch(err){
        return res.json({error: err});
    }
}

const getAllUsersTasks = async(req, res) => {
    try{
        const tasks = await service.getAllUsersTasks();
        return res.json(tasks)
    }
    catch(err) {
        return res.json({error: err});
    }
}

const getTaskById = async(req, res) => {
    try{
        const taskId = req.params.taskId;
        const task = await service.getTaskById(taskId);
        return res.json(task)
    }
    catch(err){
        return res.json({error: err});
    }
}

const addTask = async(req, res) => {
    try{
        const {user_id, task_name, due_date} = req.body;
        const answer = await service.addTask(user_id, task_name, due_date);
        return res.json(answer);
    }
    catch(err){
        return res.json({error: err});
    }
}

const editTask = async(req, res) => {
    try{
        const { task_name, due_date, status_id} = req.body;
        const taskId = req.params.taskId;

        const answer = await service.editTask(taskId, task_name, due_date, status_id);
        return res.json(answer);
    }
    catch(err) {
        return res.json({error: err});
    }
    
}

const deleteTask = async(req, res) => {
    try{
        const taskId = req.params.taskId;
        const answer = await service.deleteTask(taskId);
        return res.json(answer);
    }
    catch(err){
        return res.json({error: err});
    }
}

const getStatuses = async(req, res) => {
    try{
        const answer = await service.getStatuses();
        return res.json(answer)
    }
    catch(err){
        return res.json({error: err})
    }
}

module.exports = {getUserTasks, getAllUsersTasks, getTaskById, addTask, editTask, deleteTask, getStatuses};


