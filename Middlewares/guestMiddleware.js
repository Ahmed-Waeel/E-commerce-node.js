const { validateToken, getToken } = require('../Controllers/website/AuthController')

const mustBeGuest = (req, res, next) => {
    const token = getToken(req)

    console.log(token && validateToken(token))

    if (token && validateToken(token)) {
        return res.status(403).send({
            code: 403,
            success: false,
            message: "You don't have access to this page"
        })
    }

    next()
}

module.exports = {
    mustBeGuest
}