const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const cloudinary1 = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');


cloudinary.config({
    cloud_name: 'dork8qm8p',
    api_key: '553783255526778',
    api_secret: 'yyM8ncUoPxIiG-GbyB_MiTQ-Pcs',

})

const fileFormatLimit = (req,file,cb) => {
    if(file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" || file.mimetype === "image/svg"){
        cb(null,true)
    }else{
        cb(null,false)
    }     
}

const uploadStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    folder: "userPhoto",
    allowedFormats: ["jpg","jpeg","png","svg"],
    filename: function(req,file,cb){
        cb(null, Date.now() + "-" + file.originalname);
    }
})

// const uploadStorage = multer.diskStorage({
//     destination: function(req,file,cb){
//         cb(null, "./uploads/user")
//     },
//     filename: function(req,file,cb){
//         cb(null, Date.now() + "-" + file.originalname);
//     }
// })

const userUpload = multer({
    storage: uploadStorage,
    // fileFilter: fileFormatLimit
})



// cloud config
cloudinary1.config({
  cloud_name: "drqx56ocf",
  api_key: "246913568929862",
  api_secret: "mR5kp9lKUsndnaIuWaxkwva8dZI",
});

// storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary1,
  folder: "campaign",
  allowedFormats: ["jpg", "jpeg", "png", "svg"],
  filename: (req, files, cb) => {
    cb(null, Date.now() + "_" + files.originalname.split(".")[0]);
  },
});

const uploader = multer({
  storage: storage,
});


module.exports = {
    userUpload, uploader
};