//============ Dependencies ================
require('dotenv').config();
const User = require('./../../Models/user')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { send } = require('./../../helpers/mailer');
const secretToken = process.env.JWT_SECRET_WEBSITE

//=========== Helper Functions ==============
const hash = async (str) => {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(str, salt)
}
const generateToken = async (user) => await jwt.sign({user}, secretToken, { expiresIn: '24h' });

//========== Main Functions =================
// Register
const register = async (req, res) => {
    const { name, email, password } = req.body;

    const exist_user = await User.findOne({ email: email.toLowerCase() })

    if (exist_user) {
        return res.status(400).send({
            code: 400,
            success: false,
            message: "This Email has been Taken Before"
        });
    }

    const hashed_password = await hash(password)
    const new_user = new User({
        'name': name,
        'email': email.toLowerCase(),
        'password': hashed_password
    });
    await new_user.save();

    const token = await generateToken(new_user)

    new_user.password = undefined;

    const mailData = {
        from: process.env.MAIL_FROM_ADDRESS,
        to: `${new_user.email}`,
        subject: 'Thank YOu',
        html: ` <h1> Hi ${new_user.name} </h1> <br>,
                <h3> Thanks for being part of our community/ anniversary </h3> <br>                
                <p> thanks, </p>
        `,
    }

    send(mailData)

    return res.status(201).send({
        code: 201,
        success: true,
        message: "User Registered and Logged in Successfully",
        payload: {
            token: token,
            user: new_user
        }
    })
}

// Login
const login = async (req, res) => {
    const { email, password } = req.body;

    const existing_user = await User.findOne({ email: email.toLowerCase() });

    if (!existing_user) {
        return res.status(400).send({
            code: 400,
            success: false,
            message: "Wrong Email or Password",
        })
    }
    if (!bcrypt.compareSync(password, existing_user.password)) {
        return res.status(400).send({
            code: 403,
            success: false,
            message: "Wrong Email or Password",
        })
    }

    if (existing_user.banned) {
        return res.status(401).send({
            code: 401,
            success: false,
            message: "Your account has been banned from the admins od the website ... for any question please contact us"
        })
    }

    existing_user.password = undefined;
    const token = await generateToken(existing_user)

    return res.status(200).send({
        code: 200,
        success: true,
        message: "Logged In Successfully",
        payload: {
            token: token,
            user: existing_user
        }
    })
}


// fetch the token from the request or return false
const getToken = (req) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    return token ?? false
}

// Validate Token and Return User or False
const validateToken = (token) => {
    const user = jwt.verify(token, secretToken, (err, user) => {
        if(err) return false

        return user
    })
    return user
}

//=========== Exports the Functions ======
module.exports = {
    register, login, validateToken, getToken, generateToken, hash
}