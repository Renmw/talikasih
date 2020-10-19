const { Campaigns, Category ,UserComments ,Users } = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class campaignController {
    static async getAllCampaign(req,res,next){
        const page = req.params.page;
        try{
            const found = await Campaigns.findAll({});
            if(found){
                //res.status(200).json(found);
                const options = {
                    page,
                    paginate: 12,
                    order: [['id', 'DESC']],
                    include: {
                    model: Category,
                    attributes: ['name', 'image']
                }
                }
                const { docs, pages, total } = await Campaigns.paginate(options)

                if(page > pages){
                    res.status(404).json({message: "page not found"})
                } else{
                    res.status(200).json({
                        on_page: page,
                        total_data: total,
                        total_pages: pages,
                        document: docs,
                    })
                }
            } else{
                next({message: "failed to retrieve campaign"})
            }
        } catch (err){
            next(err)
        }
    }
    static async addCampaign(req,res,next){
        const raised = 0;
        const { title, goal, story, due_date, CategoryId, bankAccount } = req.body;
        //const header_img = "https://infinite-reef-41011.herokuapp.com/"+req.file.path;
        const header_img = req.file.path;
        const UserId = req.userData.id;
        UserId == null ? next({message: "access token not found"}) : "" ;
        title == null ? next({message: "title field is required"}) : "" ;
        goal == null ? next({message: "goal field is required"}) : "" ;
        story == null ? next({message: "story field is required"}) : "" ;
        CategoryId == null ? next({message: "CategoryId field is required"}) : "" ;
        bankAccount == null ? next({message: "bankAccount field is required"}) : "" ;
        try {
            const search = await Campaigns.findOne({where: { title }})
            if(search){
                res.status(409).json({message: "campaign already exist!"})
            } else{
                const add = await Campaigns.create({
                    title,
                    goal,
                    story,
                    due_date,
                    header_img,
                    CategoryId,
                    UserId,
                    bankAccount,
                    raised
                })
                res.status(200).json(add);   
            }
        } catch (err) {
            next(err)
        }
    }
    static async editFormCampaign (req, res, next) {
        const id = req.params.id;
        try{
            const found = await Campaigns.findOne({
                where : { id }
            });
            res.status(200).json({
                msg: "ke form edit",
                data: found
            });
        } catch (err) {
            next (err);
        }
    }
    static async editCampaign(req,res,next){
        const id = req.params.id;
        const { title, goal, story, due_date, CategoryId, bankAccount} = req.body;
        try {
            const edit = await Campaigns.update({
                title,
                goal,
                story,
                due_date,
                bankAccount,
                CategoryId
            }, {
                where: { id }
            })
            if(edit){
                const found = await Campaigns.findOne({where: {id}})
                res.status(200).json(found)
            }
        } catch (err) {
            next(err)
        }
    }
    static async editCampaignImage(req,res,next) {
        const id = req.params.id;
        const header_img = req.file.path;
        try {
            const edit = await Campaigns.update({
                header_img,
            }, {
                where: { id }
            })
            if(edit){
                const found = await Campaigns.findOne({where: {id}})
                res.status(200).json(found)
            }
        } catch (err) {
            next(err)
        }
    }
    static async deleteCampaign(req,res,next){
        const id = req.params.id;
        try {
            const search = await Campaigns.destroy({where: {id}})
            if(search){
                res.status(200).json({message: "campaign deleted"})
            } else{
                next({message: "campaign deleted failed"})
            }
        } catch (err) {
            next(err)
        }
    }
    static async getByCategory(req,res,next){
        const CategoryId = req.body.CategoryId;
        const page = req.params.page;
        try {
            const found = await Campaigns.findOne({
                where: { CategoryId }
            })
            if(found){
                const options = {
                    page,
                    paginate: 12,
                    order: [['id', 'DESC']],
                    where: { CategoryId }
                }
                const { docs, pages, total } = await Campaigns.paginate(options)
    
                if(page > pages){
                    res.status(404).json({message: "page not found"})
                } else{
                    res.status(200).json({
                        on_page: page,
                        total_data: total,
                        total_pages: pages,
                        document: docs,
                    })
                }
            } else{
                next({message: "campaign not found!"})
            }
        } catch (err) {
            next(err)
        }
    }
    static async getBySearch(req,res,next){
        const page = req.params.page;
        const { search } = req.body;
        try {
            const found = await Campaigns.findAll({
                order: [['id', 'DESC']],
                where: {
                    title: {
                        [Op.iLike]: '%' + search + '%'
                    }
                }
            })
            if(found == ''){
                next({message: "campaign not found!"})
            } else{
                //res.status(200).json(found)
                const options = {
                    page,
                    paginate: 12,
                    order: [['id', 'DESC']],
                    where: {
                        title: {
                            [Op.iLike]: '%' + search + '%'
                            }
                        }
                }
                const { docs, pages, total } = await Campaigns.paginate(options)

                if(page > pages){
                    res.status(404).json({message: "page not found"})
                } else{
                    res.status(200).json({
                        on_page: page,
                        total_data: total,
                        total_pages: pages,
                        document: docs,
                    })
                }
            }
        } catch (err) {
            next(err)
        }
    }
    static async sortByraised (req, res,next) {
        try {
            const allCampaign = await Campaigns.findAll({
                order: [['raised', 'ASC']]
            });
            res.status(200).json({
                Status: '200 - OK',
                Success: true,
                Result : allCampaign
            })
        } catch (err) {
            console.log(err);
            next(err)
        }
    }
    static async sortByPopularity (req,res,next) {
        const { page } = req.params;
        console.log(page);
        try {
            const rank = await Campaigns.findAll()
            if (rank) {
                const options = {
                    page,
                    paginate: 12,
                    order: [['point', 'DESC']],
                    }   
                const { docs, pages, total } = await Campaigns.paginate(options)
                if(page <= pages){
                    res.status(200).json({
                        Status : 200,
                        Success : true,
                        on_page: page,
                        total_data: total,
                        total_pages: pages,
                        ranked: docs,
                    })
                }else {
                    res.status(404).json({
                        msg: 'Page not found'
                    })
                }                
            }else {
                res.status(404).json({
                    msg: 'no campaign available'
                })
            }
        } catch (err) {
            next(err)
        }
    }
}

module.exports = campaignController;
