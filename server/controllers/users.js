const service = require('../services/users')

const registerUser = async(req, res) => {
    try{
        const {first_name, last_name, email, password} = req.body;
        const answer = await service.registerUser(first_name, last_name, email, password);
        return res.json(answer);
    }
    catch(err){
        return res.json({error: err});
    }
}

const loginUser = async(req, res) => {
    try{
        const {email, password} = req.body;
        const answer = await service.loginUser(email, password);
        return res.json(answer);
    }
    catch(err){
        return res.json({error: err});
    }
}

const checkEmailExistance = async(req, res) => {
    try{
        const email = req.body.email;
        const answer = await service.checkEmailExistance(email);
        return res.json(answer);
    }
    catch(err){
        return res.json({error: err})
    }
}

const getAllUsers = async(req, res) => {
    try{
        const answer = await service.getAllUsers();
        return res.json(answer);
    }
    catch(err){
        return res.json({error: err})
    }
}

const getUserById = async(req, res) => {
    try{
        const userId = req.params.userId;
        const answer = await service.getUserById(userId);
        return res.json(answer);
    }
    catch(err){
        return res.json({error: err});
    }
}

const editUser = async(req, res) => {
    try{
        const {first_name, last_name, email} = req.body;
        const userId = req.params.userId;
        const answer = await service.editUser(userId, first_name, last_name, email);
        return res.json(answer);
    }
    catch(err){
        return res.json({error: err})
    }
}

const deleteUser = async(req, res) => {
    try{
        const userId = req.params.userId;
        const answer = await service.deleteUser(userId);
        return res.json(answer);
    }
    catch(err){
        return res.json({error: err});
    }
}
module.exports = {registerUser, loginUser, checkEmailExistance, getAllUsers, getUserById, editUser, deleteUser};