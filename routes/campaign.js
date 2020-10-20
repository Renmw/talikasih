const {Router} = require('express');
const router = Router();
const campaignController = require('../controllers/Campaign');
const auth = require('../middlewares/auth');
const {uploader} = require('../middlewares/multer');

//CRUD
router.post('/add', auth.authentication, uploader.single('header_img'), campaignController.addCampaign);
router.get('/edit/:id', auth.authentication, campaignController.editFormCampaign);
router.put('/edit/:id', auth.authentication, auth.authoCampaign, campaignController.editCampaign);
router.put('/edit/image/:id', auth.authentication, auth.authoCampaign, uploader.single('header_img'), campaignController.editCampaignImage);
router.delete('/delete/:id', auth.authentication, auth.authoCampaign, campaignController.deleteCampaign);

//search
router.get('/user', auth.authentication, campaignController.getByUserId);
router.get('/popular/:page',campaignController.sortByPopularity)
router.get('/raised',campaignController.sortByraised)
router.get('/urgent', campaignController.sortByUrgency)

//get campaign by category sorting by
router.get('/categoryPopular/:CategoryId/:page', campaignController.categoryPopular)
router.get('/categoryUrgent/:CategoryId/:page', campaignController.categoryUrgent)
router.get('/categoryLess/:CategoryId/:page', campaignController.categoryLess)

//get campaign by search sorting by
router.get('/search/popular/:search/:page', campaignController.getBySearchPopular);
router.get('/search/lessdonate/:search/:page', campaignController.getBySearchLess);
router.get('/search/urgent/:search/:page', campaignController.getBySearchUrgent);

router.get('/:id',campaignController.getCampaign);

module.exports = router;
