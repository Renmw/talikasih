const {Router} = require('express');
const router = Router();
const campaignController = require('../controllers/Campaign');
const auth = require('../middlewares/auth');
const {uploader} = require('../middlewares/multer');

router.post('/add', auth.authentication, uploader.single('header_img'), campaignController.addCampaign);
//router.post('/add', auth.authentication, campaignUpload.single('header_img'), campaignController.addCampaign);
router.get('/edit/:id', auth.authentication, campaignController.editFormCampaign);
router.put('/edit/:id', auth.authentication, auth.authoCampaign, campaignController.editCampaign);
router.put('/edit/image/:id', auth.authentication, auth.authoCampaign, uploader.single('header_img'), campaignController.editCampaignImage);
router.delete('/delete/:id', auth.authentication, auth.authoCampaign, campaignController.deleteCampaign);
router.get('/popular/:page',campaignController.sortByPopularity)
router.get('/raised',campaignController.sortByraised)

module.exports = router;
