const { Router } = require('express')
const router = Router()
const auth = require('../middlewares/auth');

const UserDonationController = require ('../controllers/UserDonationsController')

// router.post('/add/:id',UserDonationController.donate)
router.post('/campaign/:id',auth.authentication,UserDonationController._donate)
router.get('/campaign',auth.authentication,UserDonationController.getUserDonationData)
module.exports= router