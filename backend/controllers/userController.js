const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/User");
const Token = require("../models/Token");
const { builtinModules } = require("module");

require("dotenv").config();


// ================ Helpers ==>>

// NOTE: move into  userModel?
const generateJWT = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "60d",
    });
};

// NOTE: move into userModel?
const generateVerificationToken = (id) => {
    return new Token({
        userId: id,
        token: crypto.randomBytes(16).toString('hex')
    }); 
}

const sendVerificationEmail = async (user, host) => {
    try {
        let newToken = generateVerificationToken(user._id);
        await Token.create(newToken);

        let link = "http://" + host + "/users/confirmation/" + newToken;
        transporter.sendMail({
            from: process.env.EMAIL_SENDER,
            to: user.email,
            subject: "Account Verification",
            text: "Hello " + user.name + ",\n\n" + "Verify your account here: " + link
        });

    } catch (error) {
        return error;
    }
}

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

    user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "Email not found" });
    }

    // NOTE: want to differentiate this 400 so frontend can redirect to resend page rather than printing default error page
    if (!user.isVerified) {
        return res.status(400).json({ message: "User not verified"});
    }

    if (await user.matchPassword(password)) {
        return res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            isVerified: newUser.isVerified,
            token: generateJWT(newUser._id),
        });
    } else {
        return res.status(400).json({ messsage: "Password doesn't match" });
    }
};

// endpoint: POST /api/users/
// desc: register new user
const userRegister = async (req, res) => {
    let { name, email, password } = req.body;
    console.log(req.body);
    console.log("registering: " + email + ", " + name + ", " + password);

    const userExists = await User.findOne({ email: email });

    if (userExists) {
        return res.status(400).json({ email: "Email already exists"});
    }

    const newUser = await User.create({
        name: name,
        email: email,
        password: password
    });
   
    // TODO: only generate and send back jwt token in login?
    if (newUser) {
        let error = await sendVerificationEmail(newUser, req.headers.host);
        if (error) {
            return res.status(500).json({ message: "Internal Error" });
        } else {
            return res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                isVerified: newUser.isVerified,
                token: generateJWT(newUser._id),
            });
        }
    } else {
        return res.status(500).json({ message: "Internal Error" });
    }
};

// endpoint: POST /api/verify
// desc: verify a user found from a given token
const verifyUser = async (req, res) => {
    const { token } = req.body;

    const userToken = await Token.findOne({ token: token });
    if (!userToken) {
        return res.status(400).json({ message: "Unable to find valid token. Your token could be expired" });
    }

    const user = await User.findOne({ _id: userToken.userId });
    if (!user) {
        return res.status(400).json({ message: "Unable to find a user with this token" });
    }

    // NOTE: need to check token expiration
    user.isVerified = true;
    user.save((err) => {
        if (err) {
            return res.status(500).json({ message: "Internal Error" });
        } else {
            return res.status(200).json({ message: "Email verified" });
        }
    })
};

// endpoint: POST /api/resend
// desc: resend email verification for given user
const resendVerification = async (req, res) => {
    const { name, email } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
        return res.status(400).json({ message: "Unable to find user" });
    }

    if (user.isVerified) {
        return res.status(200).json({ message: "Email verified" });
    }

    let error = await sendVerificationEmail(user, req.headers.host);
    if (error) {
        return res.status(500).json({ message: "Internal Error" });
    } else {
        return res.status(201).json({ message: "Verification resent to " + user.email});
    }
}

// NOTE: need endpoints for: getting user info and editing a user  

module.exports = {
    userRegister, 
    userLogin, 
    verifyUser, 
    resendVerification
};