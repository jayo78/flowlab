const express = require("express");
const router = express.Router();
const {
    userRegister,
    userLogin,
    verifyUser,
    resendVerification,
} = require("../controllers/userController");

// require auth middlewear
// TODO: add data verification checks before sending to controller endpoints (middleware?)
// https://stackoverflow.com/questions/54160430/where-we-put-validation-logic-in-nodejs-mvc

// Im pretty sure with middleware we could auth and verify before passing to controller like this:
// router.post("/endpoint", validateMiddlewear, authMiddlewear, controller)

router.route("/")
    .post(userRegister);

router.post("/login", userLogin);
router.post("/verify", verifyUser);
router.post("/resend", resendVerification);

module.exports = router;