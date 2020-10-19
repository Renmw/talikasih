const { Status } = require('../models')

class StatusController {
    static async getStatus(req,res,next){
        try {
            const statuses = await Status.findAll({
                order: [
                    ['id', 'ASC']
                ]
            })
            res.status(200).json(statuses)
        } catch(err){
            next(err)
        }
    }
    static async addStatus(req,res,next){
        const { name } = req.body
        try {
            const add = await Status.create({
                name
            })
            res.status(201).json(add)
        } catch(err) {
            next(err)
        }
    }
}

module.exports = StatusController
