const { Router } = require ('express')
const router = Router()
const DonationRoutes = require('./userDonations')

router.use('/donate',DonationRoutes);

const userController = require('../controllers/Users')
const CommentRoutes = require('./comment')
const LogRoutes = require('./campaignLog')
const StatusRoutes = require('./status')
const auth = require('../middlewares/auth');
const {userUpload} = require('../middlewares/multer')

router.use('/comment', CommentRoutes)
router.use('/campaignLog', LogRoutes)
router.use('/status', StatusRoutes)

router.post('/',userController.register);
router.post('/login',userController.login)
router.get('/allusers',userController.getAllUsers)
router.put('/',auth.authentication,userController.updateUser);
router.delete('/',auth.authentication,userController.deleteUser)
router.put('/image',auth.authentication,userUpload.single("photo"),userController.updateUserImage)
router.get('/formuser',auth.authentication,userController.editFormUser);


//category
const categoryRoutes = require('./category');
router.use('/category', categoryRoutes);

//campaign create
const campaignRoutes = require('./campaign');
router.use('/campaign', campaignRoutes);

//discover campaign
const campaignController = require('../controllers/Campaign');
router.get('/discover/all/:page', campaignController.getAllCampaign);
router.get('/discover/category/:CategoryId/:page', campaignController.getByCategory);
router.get('/discover/search/:search/:page', campaignController.getBySearch);
router.get('/discover/trending', campaignController.getTrending);

exports.router = router;
