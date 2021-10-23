const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const validateRegisterInput = require("../auth/register");
const validateLoginInput = require("../auth/login");
const User = require("../models/User");
const Token = require("../models/Token")
const nodemailer = require("nodemailer")
const crypto = require("crypto")

router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });


      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => console.log(user))//res.json(user))
            .catch(err => console.log(err));
        });
      });
    
      console.log(res.ended)
      var token = new Token({ _userId: req.body.name, token: crypto.randomBytes(16).toString('hex') });
      token.save(function (err) {
        if(err) {
          return res.status(500).send({ msg: 'Internal Error' })
        }
	
        console.log(res.ended)
      	console.log('\nhttp:\/\/' + req.headers.host + '\/confirmation\/' + req.body.email + '\/' + token.token)
      	var sender = nodemailer.createTransport({ service: 'Gmail', secure: true, socketTimeout: 5000, auth: { user: 'rajkarra38@gmail.com', pass: 'A@L#1111' } })
      	console.log('sender created')
	      var mailConfig = { from: 'rajkarra38@gmail.com', to: req.body.email, subject: 'Account Verification Link', text: 'Hello '+ req.body.name +',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + req.body.email + '\/' + token.token + '\n\nThank You!\n' }
        
      	//sender.sendMail(mailConfig, function(err) {
	      //console.log(res.ended)
        //  console.log('sending mail')
	        //  if(err) {
	        //return res.status(500).send({ msg: 'Internal Error'})
	          //  }
	        //  else {
	          //	return res.status(200).send({ msg: 'A verification email has been sent to ' + user.email + '. It will be expire after one day. If you not get verification Email click on resend token.' })
	          //}   
        sender.sendMail(mailConfig, function(err) {
		if(err) {
		  res.status(500).send('Internal Error')
		}
	});
	res.status(200).send({ msg: 'A verification email has been sent to ' + req.body.email + '. It will be expire after one day. If you not get verification Email click on resend token.' })
      });
    }
  });
})



router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email }).then(user => {
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }
    else if(!user.isVerified) {
	return res.status(404).json({ verified: "Not verfied"})
    }
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const payload = {
          id: user.id,
          name: user.name
        };

        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926 
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

module.exports = router
