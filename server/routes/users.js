const express = require('express');

const router = express.Router();

const controller = require('../controllers/users');

router.get('/', controller.getAllUsers);

router.route('/user/:userId')
    .get(controller.getUserById)
    .put(controller.editUser)
    .delete(controller.deleteUser)

router.post('/register', controller.registerUser)

router.post('/login', controller.loginUser)

router.post('/checkEmailExistance', controller.checkEmailExistance)

module.exports = router;