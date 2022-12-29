//============ Dependencies ================
require('dotenv').config();
const Admin = require('./../../Models/admin')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secretToken = process.env.JWT_SECRET_DASHBOARD

//=========== Helper Functions ==============
const hash = async (str) => {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(str, salt)
}
const generateToken = async (admin) => jwt.sign({ admin }, secretToken, { expiresIn: '24h' });


//========== Main Functions =================
// Login
const login = async (req, res) => {
    const { email, password } = req.body;

    const existing_admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!existing_admin) {
        return res.status(400).send({
            code: 400,
            success: false,
            message: "Wrong Email or Password",
        })
    }
    if (!bcrypt.compareSync(password, existing_admin.password)) {
        return res.status(400).send({
            code: 403,
            success: false,
            message: "Wrong Email or Password",
        })
    }

    existing_admin.password = undefined;
    const token = await generateToken(existing_admin)
    
    return res.status(200).send({
        code: 200,
        success: true,
        message: "Logged In Successfully",
        payload: {
            token: token,
            admin: existing_admin
        }
    })
}


// fetch the token from the request or return false
const getToken = (req) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    return token ?? false
}

// Validate Token and Return Admin or False
const validateToken = (token) => {
    const admin = jwt.verify(token, secretToken, (err, admin) => {
        if(err) return false

        return admin
    })
    return admin
}

//=========== Exports the Functions ======
module.exports = {
    login, validateToken, getToken, generateToken, hash
}