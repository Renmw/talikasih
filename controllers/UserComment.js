const { UserComments,Campaigns,Users } = require('../models')

class CommentController {
    static async getComment(req,res,next){
        try {
            const comments = await UserComments.findAll({
                order: [
                    ['id', 'DESC']
                ],
                include : [
                    Campaigns,Users
                ]
            })
            res.status(200).json(comments)
        } catch(err){
            next(err)
        }
    }
    static async addComment(req,res,next){
        const UserId = req.userData.id
        const CampaignId = req.params.id
        const { content,date } = req.body
        try {
            const add = await UserComments.create({
                UserId,CampaignId,content,date
            })
            if (add) {
                const campaign = await Campaigns.findOne({
                    where: {
                        id : CampaignId
                    }
                })

                const PrevPoint = Number(campaign.point)
                const addPoint = PrevPoint +1
                const point = Campaigns.update({
                    point : addPoint},{
                    where: {
                        id : CampaignId
                    }
                })
            }
            res.status(201).json(add)
        } catch(err) {
            next(err)
        }
    }
    static async deleteComment(req, res, next) {
        const id = req.params.id;
        try {
            const deleted = await UserComments.destroy({
                where: { id }
            })
            if (deleted) {
                const PrevPoint = Number(Campaigns.point)
                const addPoint = PrevPoint -1
                const point = Campaigns.update({
                    point : addPoint},{
                    where: {
                        id : CampaignId
                    }
                })
            }
            res.status(200).json({
                msg:"Comment deleted"
            })
        }
        catch(err) {
            next(err);
        }
    }
    static async editComment(req,res,next) {
        const id = req.params.id;
        const { UserId,CampaignId,content,date } = req.body;
        try{
            const update = await UserComments.update({ UserId,CampaignId,content,date },{ 
                where : {
                    id
                }
            })
        res.status(201).json({
            msg: "Comment updated"
        })
        } catch(err){
            next(err);        
        }
    }
    static async findByCampaign(req,res,next) {
        const CampaignId = req.params.CampaignId;
        const page = req.params.page      
        try{
            const comment = await UserComments.findAll({
                where : {
                    CampaignId
                }
            })
            if (!comment){
                res.send(404).json({
                    msg: "There is no comment found in this campaign"
                })
            } else {
                const options = {
                    page, 
                    paginate: 6,
                    where : {
                        CampaignId
                    },
                    include : {
                        model : Users,
                        attributes: ['name','photo']
                    }
                }
            const { docs, pages, total } = await UserComments.paginate(options)
            if (page > pages){
                res.status(404).json({
                    msg : "page not found"
                })
            } else {
                res.status(200).json({
                    total_page : pages,
                    comments: docs,
                })
            }
            }
        } catch(err){
            next(err);
        }
    }
    static async allComment(req,res,next){
        const CampaignId = req.params.CampaignId;
        try{
            const comment = await UserComments.findAll({
                where : {
                    CampaignId
                }
            })
            if (!comment){
                res.send(404).json({
                    msg: "There is no comment found in this campaign"
                })
            } else {
                const comments = await UserComments.findAll({
                    where : {
                        CampaignId
                    },
                    include : {
                        model : Users,
                         attributes: ['name','photo']
                    }
                }) 
                res.status(200).json({comments}) 
            }
        } catch(err){
            next(err);
        }
    }
}

module.exports = CommentController