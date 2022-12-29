// Dependencies
const User = require('../../Models/user')

// Set User Status if Active or Banned
const setStatus = async (req, res) => {
    const { user_id, banned } = req.body

    const user_data = await User.findOne({ _id: user_id })

    await User.updateOne({ _id: user_id }, { banned: banned })

    return res.status(200).send({
        code: 200,
        success: true,
        message: "User Status has been changed Successfully",
        payload: {
            user: user_data
        }
    })
}

const userBalance = async (req, res) => {
    const { user_id, balance } = req.body

    const user_data = await User.findOne({ _id: user_id })
    
    if (!user_data) {
        return res.status(404).send({
            code: 404,
            success: false,
            message: "User Not FOund"
        })
    }

    await User.updateOne({ _id: user_id }, { balance: balance ?? 0 })
   
    return res.status(200).send({
        code: 200,
        success: true,
        message: "Balance Changed Successfully"

    })
}

// Export the Functions
module.exports = {
    setStatus, userBalance
}