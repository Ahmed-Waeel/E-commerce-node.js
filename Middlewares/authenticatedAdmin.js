const { validateToken, getToken } = require('../Controllers/dashboard/AuthController')

const mustBeAdmin = (req, res, next) => {
    const token = getToken(req)

    if (!token) return res.status(401).send({
        code: 400,
        success: false,
        message: "Authentication Token Not Found",
    })

    const admin = validateToken(token)
    if (!admin) {
        return res.status(401).send({
            code: 401,
            success: false,
            message: "Not Valid or Expired Token"
        })
    } 

    req.admin = admin
    next()
}

module.exports = {
    mustBeAdmin
}