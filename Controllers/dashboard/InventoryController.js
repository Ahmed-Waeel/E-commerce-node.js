const Inventory = require('./../../Models/inventory')

const add = async (req, res) => {
    const { product_id, quantity } = req.body

    const new_import = new Inventory({
        product_id: product_id,
        quantity: quantity
    })

    await new_import.save()

    return res.status(201).send({
        code: 201,
        success: true,
        message: "Quantity Added to Stock",
        payload: {
            admin: req.admin,
            data: new_import
        }
    })
}

const remove = async (req, res) => {
    const { product_id, quantity } = req.body

    const new_export = new Inventory({
        product_id: product_id,
        quantity: -quantity
    })

    await new_export.save()

    return res.status(201).send({
        code: 201,
        success: true,
        message: "Quantity rempved from Stock",
        payload: {
            admin: req.admin,
            data: new_export
        }
    })
}

module.exports = {
    add, remove
}