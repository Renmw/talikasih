const { UserDonations, Users , Campaigns } = require ('../models')

class UserDonationController {
    // User donation dengan validasi
    static async donate (req, res, next) {
        const UserId = req.userData.id
        const  CampaignId  = req.params.id
        const { amount, share, comment } = req.body
        try {
            //Validasi apakah Campaigns ada
            const validCampaign = await Campaigns.findOne({
                where : {
                    id : CampaignId
                }
            })
            if (validCampaign) {
                //Validasi apakah goals sudah tercapai
                if(validCampaign.raised < validCampaign.goal){
                    //pengecekan sisa yang dibutuhkan
                    const expected = validCampaign.goal - validCampaign.raised;
                    if (expected == 0) {
                        res.status(400)({
                            Success : false,
                            message : "This Campaign's goal has been acheived"
                        })
                    } else {
                        if(amount > expected){
                            res.status(400).json({
                                Success : false,
                                message : `This Campaign only need Rp. ${expected} more, please use the rest of your money for other Campaigns`
                            })
                        } else {
                            const add = await UserDonations.create({
                                UserId,
                                CampaignId,
                                amount,
                                share,
                                comment
                            })
                            const raisedData = await Campaigns.findOne({
                                where: {
                                    id : CampaignId
                                }
                            })
                            const raisedBefore = raisedData.raised;
                            const raisedAfter = raisedBefore + amount;
                            const addRaised = await Campaigns.update({
                                raised: raisedAfter},{
                                where: {
                                    id : CampaignId
                                }
                            })
                            res.status(400).json({
                                Success : true,
                                message : `Thank you for donating Rp. ${amount} for this campaign`
                            })
                        }
                        } 
                    }
            } else {
                res.status(404).json({
                    Success : false,
                    message: "Campaign not Found"
                })
            }
        }
        catch (err) {
            next(err)
        }
    }
    // user donation tanpa validasi
    static async _donate (req,res,next) {
        const UserId = req.userData.id;
        const CampaignId = req.params.id
        const { amount, share, comment} = req.body
        try {
            const validCampaign = await Campaigns.findOne({
                where : {
                    id : CampaignId
                }
            })
            if (validCampaign){
                const add = await UserDonations.create({
                    UserId,
                    CampaignId,
                    amount,
                    share,
                    comment
                })
                //Menambahkan amount ke campaign.raised
                const raisedData = await Campaigns.findOne({
                    where: {
                        id : CampaignId
                    }
                })
                const raisedBefore = Number(raisedData.raised);
                const raisedAfter = raisedBefore + Number(amount);
                const PrevPoint = Number(raisedData.point);
                const updatePoint = PrevPoint+2
                const addRaised = await Campaigns.update({
                    raised: raisedAfter,
                    point: updatePoint},{
                    where: {
                        id : CampaignId
                    }
                })
                res.status(400).json({
                    Success : true,
                    message : `Thank you for donating Rp. ${amount} for this campaign`,
                    data : add
                })
            }else {
                res.status(404).json({
                    Success : false,
                    message: "Campaign not Found"
                })
            }
        } catch (err) {
            next(err)
        }
    }
    static async getUserDonationData (req, res, next) {
        const UserId = req.userData.id
        try {
            const found = await UserDonations.findAll({
                where : {
                    UserId : UserId 
                }, include : [Campaigns]
            })
            res.status(200).json({
                Success : true,
                UserId: UserId,
                name: req.userData.name,
                Result : found
            })
        } catch (err) {
            next(err)
        }
    }
}
module.exports = UserDonationController
