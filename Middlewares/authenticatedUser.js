const { validateToken, getToken } = require('../Controllers/website/AuthController')

const mustBeAuthenticated = (req, res, next) => {
    const token = getToken(req)

    if (!token) return res.status(401).send({
        code: 400,
        success: false,
        message: "Authentication Token Not Found",
    })

    const user = validateToken(token)
    if (!user) {
        return res.status(401).send({
            code: 401,
            success: false,
            message: "Not Valid or Expired Token"
        })
    } 

    req.user = user
    next()
}

module.exports = {
    mustBeAuthenticated
}