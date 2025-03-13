const express = require('express');

const router = express.Router();

const controller = require('../controllers/tasks');

router.route('/task/:taskId')
    .get(controller.getTaskById)
    .put(controller.editTask)
    .delete(controller.deleteTask)

router.get('/userTasks/:userId', controller.getUserTasks)

router.get('/allUsersTasks', controller.getAllUsersTasks)

router.get('/statuses', controller.getStatuses)

router.post('/', controller.addTask);


module.exports = router;