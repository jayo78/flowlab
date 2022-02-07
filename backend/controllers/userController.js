const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const User = require('../models/User');
const Token = require('../models/Token');

require('dotenv').config();

// ================ Helpers ==>>

// NOTE: move into  userModel?
const generateJWT = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '60d'
    });
};

// NOTE: move into userModel?
const generateVerificationToken = (id) => {
    return new Token({
        userId: id,
        token: crypto.randomBytes(16).toString('hex')
    });
};

const sendVerificationEmail = async (user, host) => {
    let newToken = generateVerificationToken(user._id);
    await Token.create(newToken);

    let link = 'http://' + host + '/api/users/verify/' + newToken.token;
    await transporter.sendMail({
        from: process.env.EMAIL_SENDER,
        to: user.email,
        subject: 'Account Verification',
        text: 'Hello ' + user.name + ',\n\n' + 'Verify your account here: ' + link
    });
};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    socketTimeout: 5000,
    auth: {
        user: process.env.EMAIL_SENDER,
        pass: process.env.EMAIL_PASS
    }
});

// ================ Endpoints for routes ==>>

// endpoint: POST /api/users/login
// desc: login user and return jwt
const userLogin = async (req, res) => {
    let { email, password } = req.body;
    console.log('[userController] logging in: ' + email + ', ' + password);

    const user = await User.findOne({ email: email });
    if (!user) {
        console.error("\tuser doesn't exist");
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    // NOTE: want to differentiate this 400 so frontend can redirect to resend page rather than printing default error page
    // NOTE: use a 302 status code to redirect
    // if (!user.isVerified) {
    //     return res.status(400).json({ message: "User not verified"});
    // }

    if (await user.matchPassword(password)) {
        return res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isVerified: user.isVerified,
            token: generateJWT(user._id),
            tasks: user.tasks
        });
    } else {
        console.error("\tpassword doesn't match");
        return res.status(400).json({ message: 'Invalid email or password' });
    }
};

// endpoint: POST /api/users/
// desc: register new user
const userRegister = async (req, res) => {
    let { name, email, password } = req.body;
    console.log('[userController] registering: ' + email + ', ' + name + ', ' + password);

    const userExists = await User.findOne({ email: email });
    if (userExists) {
        console.error('\temail already exists');
        return res.status(400).json({ message: 'Email already exists' });
    }

    const newUser = await User.create({
        name: name,
        email: email,
        password: password,
        tasks: [],
        archivedTasks: []
    });

    if (newUser) {
        return res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            isVerified: newUser.isVerified,
            token: generateJWT(newUser._id),
            tasks: newUser.tasks,
            archivedTasks: newUser.tasks
        });
    } else {
        console.error('\tcould not create user');
        return res.status(500).json({ message: 'Internal Error' });
    }
    // NOTE: Delete user account if verification sending fails? invalid email right?
    // sendVerificationEmail(newUser, req.headers.host)
    // .then(() => {
    // return res.status(201).json({
    // _id: newUser._id,
    // name: newUser.name,
    // email: newUser.email,
    // isVerified: newUser.isVerified,
    // token: generateJWT(newUser._id)
    // });
    // })
    // .catch((error) => {
    // console.error('\tsendVerificationEmail Failed: ' + error.message);
    // return res.status(400).json({ message: 'Failed to send email to ' + email });
    // });
    // } else {
    // return res.status(500).json({ message: 'Internal Error' });
    // }
};

// endpoint: GET /api/verify/:token
// desc: verify a user found from a given token
const verifyUser = async (req, res) => {
    const { token } = req.params;
    console.log('[userController] verifying: ' + token);

    const userToken = await Token.findOne({ token: token });
    if (!userToken) {
        console.error('\ttoken not found');
        return res
            .status(400)
            .json({ message: 'Unable to find valid token. Your token could be expired' });
    }

    const user = await User.findOne({ _id: userToken.userId });
    if (!user) {
        console.error('\ttoken reference user not found');
        return res.status(400).json({ message: 'Unable to find a user with this token' });
    }

    // NOTE: need to check token expiration
    user.isVerified = true;
    user.save((err) => {
        if (err) {
            console.error('\tcould not save user: ' + err);
            return res.status(500).json({ message: 'Internal Error' });
        } else {
            console.error('\tisVerfied set, user updated');
            return res.status(200).json({ message: 'Email verified' });
        }
    });
};

// endpoint: POST /api/resend
// desc: resend email verification for given user
const resendVerification = async (req, res) => {
    const { name, email } = req.body;
    console.log('[userController] resendVerification: ' + name + ' ' + email);

    const user = await User.findOne({ email: email });
    if (!user) {
        console.error('\tuser not found');
        return res.status(400).json({ message: 'Unable to find user' });
    }

    if (user.isVerified) {
        return res.status(200).json({ message: 'Email verified' });
    }

    let error = await sendVerificationEmail(user, req.headers.host);
    if (error) {
        console.error('\terror sendVerification: ' + error);
        return res.status(500).json({ message: 'Internal Error' });
    } else {
        console.log('\tverification sent');
        return res.status(201).json({ message: 'Verification resent to ' + user.email });
    }
};

// TODO: add additional fields for update like profile related things
//  if a field is not null then update it
// endpoint: POST /api/edituser
// desc: edit user info
const editUserInfo = async (req, res) => {
    const { name, email } = req.body;
    console.log('[userController] editing user');
    console.log('\tname: ' + name);
    console.log('\temail: ' + email);

    if (!name) {
        // if all fields null
        return res.status(400).json({ message: "Can't change user info to null field" });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
        console.error('\tuser not found');
        return res.status(400).json({ message: 'Unable to find user' });
    }

    const userExists = await User.findOne({ name: name });
    if (userExists) {
        return res.status(400).json({ message: 'User with provided name already exists' });
    }

    user.name = name;
    user.save((err) => {
        if (err) {
            console.error('\tcould not save user: ' + err);
            return res.status(500).json({ message: 'Internal Error' });
        } else {
            console.log('\tuser updated');
            return res.status(201);
        }
    });
};

const addTask = async (req, res) => {
    console.log('[userController] addTask')

    const userID = req.params.userID;
    const user = User.findOne({_id: userID});

    if (!user) {
        console.error('\tuser not found');
        return res.status(400).json({ message: 'Unable to find user' });
    }

    console.log(user.tasks)
    if (!user.tasks) {
        console.error('\tuser tasks field not found');
        return res.status(400).json({ message: 'Unable to find tasks reference for user' })
    }

    // add task to user's tasks field
    user.tasks.push(newTask);

    return res.status(201).json({
        _id: newTask._id.toString(),
        creator_id: newTask.creator_id,
        name: newTask.name,
        dateCreated: newTask.dateCreated,
    });
}

const getUserTasks = async (req, res) => {
    console.log("[userController] getUserTasks");

    const userID = req.params.userID;
    let user = await User.findOne({ _id: userID });
    if (!user) {
        return res.status(400).message(`user with provided user ID ${userID} not found`);
    }
    if (!user.tasks) {
        return res.status(400).message(`user with provided user ID ${userID} has no tasks field`);
    }
    
    const _tasks = user.tasks.map((taskID) => {
        return Task.findOne({ _id: taskID }).then(task => task.json());
    });

    return res.status(200).json({ 
        tasks: _tasks 
    });
}


// NOTE: need endpoints for: getting user info and editing a user

module.exports = {
    userRegister,
    userLogin,
    verifyUser,
    resendVerification,
    editUserInfo,
    addTask,
    getUserTasks,
};
