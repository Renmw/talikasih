const { CampaignLog,Status,Campaigns,Users } = require('../models')
class LogController {
    static async getLog(req,res,next){
        try {
            const logs = await CampaignLog.findAll({
                order: [
                    ['createdAt', 'DESC']
                ], 
                include : [
                    Status,Campaigns,Users
                ]
            })
            res.status(200).json(logs)
        } catch(err){
            next(err)
        }
    }
    static async addLog(req,res,next){
        const UserId = req.userData.id
        // Log and withdrawal berdasarkan CampaignId
        const CampaignId  = req.params.CampaignId
        const { StatusId,content,date } = req.body
        const ammount = Number(req.body.ammount);
        try {
            if (StatusId == 2){
               const createLog = await CampaignLog.create({
                    UserId,CampaignId,StatusId,content,date,ammount
               })
               res.status(201).json(createLog)
            } else {
                const checkRaised = await Campaigns.findOne({
                    where : {
                        id : CampaignId
                    } 
                })
                const limit = checkRaised.raised
                const checkAmount = await CampaignLog.findAll({
                    where : {
                        CampaignId
                    } 
                })
                let getTotal = 0;
                checkAmount.forEach(el => {
                getTotal += el.ammount
                })
                console.log(getTotal, limit, ammount); 
                if ( limit < (getTotal + ammount)){
                    res.status(404).json({ msg: "Not enough raised donation to withdrawal for this campaign"})
                } else {
                    const createWithdrawal = await CampaignLog.create({
                        UserId,CampaignId,StatusId,content,date,ammount
                    })
                res.status(201).json(createWithdrawal)
                }            
            }
        } catch(err) {
            next(err) 
        }
    }
    static async editLog(req,res,next) {
        const UserId = req.userData.id;
        const id = req.params.id;
        const { CampaignId,StatusId,content,date } = req.body;
        try{
            const update = await CampaignLog.update({ UserId,CampaignId,StatusId,content,date },{ 
                where : {
                    id
                }
            })
        res.status(201).json({
            msg: "Log updated"
        })
        } catch(err){
            next(err);        
        }
    }
    static async findByCampaign(req,res,next){
        const CampaignId = req.params.CampaignId;
        const page = req.params.page      
        try{
            const comment = await CampaignLog.findAll({
                where : {
                    CampaignId
                }
            })
            if (!comment){
                res.send(404).json({
                    msg: "There is status campaign found in this campaign"
                })
            } else {
                const options = {
                    page, 
                    paginate: 4,
                    include : [
                        Campaigns,Users
                    ]
                }
            const { docs, pages, total } = await CampaignLog.paginate(options)
            if (page > pages){
                res.status(404).json({
                    msg : "page not found"
                })
            } else {
                res.status(200).json({
                    total_page : pages,
                    Campaign_Logs: docs,
                })
            }
            }
        } catch(err){
            next(err);
        }
    }
    static async deleteLog(req, res, next) {
        const UserId = req.userData.id;
        const id = req.params.id;
        try {
            const deletee = await CampaignLog.destroy({
                where: { id, UserId }
            })
            if(deletee){
                res.status(200).json({
                    msg:"Status campaign deleted"
                })
            } else{
                res.status().json({
                    msg:"Campaign log not found"
                })
            }
        }
        catch(err) {
            next(err);
        }
    }
}
//

module.exports = LogController
