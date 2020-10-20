const { Campaigns, Category ,UserComments } = require('../models');
const {Users} = require('../models');
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

    //CRUD
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

    //Get Champaign by
    static async getByCategory(req,res,next){
        const CategoryId = req.params.CategoryId;
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
        const { search } = req.params;
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
                        },
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
            }
        } catch (err) {
            next(err)
        }
    }

    static async sortByraised (req, res,next) {
        try {
            const allCampaign = await Campaigns.findAll({
                order: [['raised', 'ASC']],
                include: {
                    model: Category,
                    attributes: ['name', 'image']
                }
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
        //console.log(page);
        try {
            const rank = await Campaigns.findAll()
            if (rank) {
                const options = {
                    page,
                    paginate: 12,
                    order: [['point', 'DESC']],
                    include: {
                        model: Category,
                        attributes: ['name', 'image']    
                        }
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
    static async sortByUrgency(req,res,next){
        try{
            const campaign = await Campaigns.findAll({
                order: [
                    ['due_date','ASC']
                ],
                include: {
                    model: Category,
                    attributes: ['name', 'image']    
                }
            })
            res.status(200).json(campaign)
        } catch(err){
            next(err)
        }
    }

    //Discover Campaign by Category, sort by (most urgent, popular, less donation)
    static async categoryPopular (req,res,next) {
        const CategoryId = req.params.CategoryId
        const { page } = req.params;
        try {
            const rank = await Campaigns.findAll({
                where : {
                    CategoryId
                }
            })
            if (rank) {
                const options = {
                    page,
                    paginate: 12,
                    order: [['point', 'DESC']],
                    where: { CategoryId },
                    include: [Category]
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
                } else {
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
    static async categoryUrgent(req,res,next){
        const CategoryId = req.params.CategoryId
        const page = req.params.page
        try {
            const urgent = await Campaigns.findAll({
                where : {
                    CategoryId
                }
            })
            if (urgent) {
                const options = {
                    page,
                    paginate: 12,
                    order: [['due_date', 'ASC']],
                    where: { CategoryId },
                    include: [Category]
                    }   
                const { docs, pages, total } = await Campaigns.paginate(options)
                if(page <= pages){
                    res.status(200).json({
                        Status : 200,
                        Success : true,
                        on_page: page,
                        total_data: total,
                        total_pages: pages,
                        urgent: docs,
                    })
                } else {
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
    static async categoryLess(req,res,next){
        const CategoryId = req.params.CategoryId
        const page = req.params.page
        try {
            const urgent = await Campaigns.findAll({
                where : {
                    CategoryId
                }
            })
            if (urgent) {
                const options = {
                    page,
                    paginate: 12,
                    order: [['raised', 'ASC']],
                    where: { CategoryId },
                    include: [Category]
                    }   
                const { docs, pages, total } = await Campaigns.paginate(options)
                if(page <= pages){
                    res.status(200).json({
                        Status : 200,
                        Success : true,
                        on_page: page,
                        total_data: total,
                        total_pages: pages,
                        less: docs,
                    })
                } else {
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

    //Discover Campaign by Search, sort by (most urgent, popular, less donation)
    static async getBySearchPopular(req,res,next){
        const page = req.params.page;
        const { search } = req.params;
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
                    order: [['point', 'DESC']],
                    where: {
                        title: {
                            [Op.iLike]: '%' + search + '%'
                            }
                        },
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
            }
        } catch (err) {
            next(err)
        }
    }
    
    static async getBySearchLess(req,res,next){
        const page = req.params.page;
        const { search } = req.params;
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
                    order: [['raised', 'ASC']],
                    where: {
                        title: {
                            [Op.iLike]: '%' + search + '%'
                            }
                        },
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
            }
        } catch (err) {
            next(err)
        }
    }

    static async getBySearchUrgent(req,res,next){
        const page = req.params.page;
        const { search } = req.params;
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
                    order: [['due_date', 'ASC']],
                    where: {
                        title: {
                            [Op.iLike]: '%' + search + '%'
                            }
                        },
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
            }
        } catch (err) {
            next(err)
        }
    }

    //search campaign by Id
    static async getCampaign(req,res,next){
        const id = req.params.id;
        try{
            const found = await Campaigns.findOne({
				where: {id},
				include: [Users,Category],
			});
            if(found){
                res.status(200).json({found})
            }else{
                next({message: "campaign not found!"})
            }
        }catch(err){
            next(err)
        }
    }

    //trending
    static async getTrending (req,res,next){
        try {
            const trending = await Campaigns.findOne({
                order: [['point', 'DESC']],
                include: [{
                    model: Category,
                    attributes: ['name', 'image'],
                },{
                    model: Users,
                    attributes: ['name', 'photo'],
                }],
            });
            res.status(200).json(trending);
        } catch (err) {
            next(err);
        }
    }

    //Get Champaign by UserId
    static async getByUserId (req,res,next){
        const UserId = req.userData.id;
        try {
            const found = await Campaigns.findAll({
                where : {UserId : UserId},
                include : {
                model : Category,
                attributes: ['name', 'image']
                }
            })
            if(found){
                res.status(200).json(found);
            } else{
                res.status(404).json({message: "Campaign not found"});
            }
        } catch (err) {
            next(err)
        }
    }

}

module.exports = campaignController;
