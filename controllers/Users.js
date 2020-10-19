const {Users} = require('../models')
const {decryptPwd} = require('../helpers/bcrypt')
const {tokenGenerator} = require('../helpers/jwt')

class userController{
    static async getAllUsers(req,res,next){
        try{
            const all = await Users.findAll({})
            if(all){
                res.status(200).json(all)
            }else{
                next({message: "something went wrong"})
            }
        }catch(err){
            next(err)
        }
    }
    static async register(req,res,next){
        const {email,password,name, photo} = req.body;
        email == null ? next({message: "Email field is required"}) : "" ;
        password == null ? next({message: "Password field is required"}) : "" ;
        name == null ? next({message: "Name field is required"}) : "" ;
        let role = "";
        if(req.body.role == null || undefined){
            role = "user"
        }else{
            role = req.body.role;
        }

        try{
            const found = await Users.findOne({where: {email}})
            if(found){
                next({message: "Email already in use"})
            }
            const user = await Users.create({email,password,name,role})
            if(user){
                const token = tokenGenerator(user)
                res.status(200).json({token});
            }else{
                next({message: "There is something wrong with the input"});
            }
        }catch(err) {
            next(err) 
        }
    }

    static async login(req,res,next){
        const {email,password} = req.body;
        email == null ? "Email field is required" : email;
        password == null ? "Password field is required" : password;

        try{
            const found = await Users.findOne({where: {email}})
            if(found){
                if(decryptPwd(password,found.password)){
                    const token = tokenGenerator(found);
					res.status(200).json({ token });
                }else{
                    next({message: `invalid password`});
                }                                
            }else{
                next({message: "Email not found"})
            }
        }catch(err){
            next(err)
        }     
    }

    static async deleteUser(req,res,next){
        const {id} = req.userData;
        try{
            const boom = await Users.destroy({where: {id}})
            if(boom){
                res.status(200).json({msg: "Deleted"})
            }else{
                next({message: "Delete failed"})
            }
        }catch(err){
            next(err)
        }
    }

    static async editFormUser(req,res,next){
        const {id} = req.userData;
        try{
            const user = await Users.findOne({where: {id}, attributes: {exclude: [`password`]}})
            if(user){
                res.status(200).json({user});                
            }else{
                next({message: "User not found"})
            }

        }catch(err){
            next(err)
        }
    }

    static async updateUser(req,res,next){
        const {id} = req.userData;
        try{
            if(req.body.email){
                const check = await Users.findOne({where: {email: req.body.email}})
                if(check){
                    next({message: "Email already exist!"});
                }
            }
            const update = await Users.update((req.body),{where: {id}})
            if(update){
                const user = Users.findOne({where: {id}})
                const token = tokenGenerator(user)
                res.status(200).json({token})
            }
        }catch(err){
            next(err)
        }
    }

    static async updateUserImage(req,res,next){
        const {id} = req.userData;
        console.log(req.file)
        const photo = req.file.path;
        try{
            const update = await Users.update({photo},{where: {id}})
            if(update){
                const user = Users.findOne({where: {id}})
                const token = tokenGenerator(user)
                res.status(200).json({token})
            }
        }catch(err){
            next(err)
        }
    }
}

module.exports = userController;
