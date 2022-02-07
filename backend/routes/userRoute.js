const express = require('express');
const router = express.Router();
const {
    userRegister,
    userLogin,
    verifyUser,
    resendVerification,
    getUserTasks,
    addTask,
} = require('../controllers/userController');
const getTask = require('../controllers/taskController').getTask
//const { verifyJWT } = require("../middleware/auth/protect")
//console.log(verifyJWT)
// require auth middlewear
// TODO: add data verification checks before sending to controller endpoints (middleware?)
// https://stackoverflow.com/questions/54160430/where-we-put-validation-logic-in-nodejs-mvc

// Im pretty sure with middleware we could auth and verify before passing to controller like this:
// router.post("/endpoint", validateMiddlewear, authMiddlewear, controller)

router.post('/', userRegister);

/*
router.route("/sample")
    .get(verifyJWT, (req, res) => {
        res.send("protected route test")	
    });
*/

router.post('/login', userLogin);
router.post('/resend', resendVerification);
router.get('/verify/:token', verifyUser);

// for tasks
router.get('/:userID/tasks', getUserTasks);
router.post('/:userID/tasks', addTask);
router.get('/tasks/:taskID', getTask)
/*
router.get("/sample", verifyToken, (req, res) => {
    res.send("protect test success")
});
*/
module.exports = router;
