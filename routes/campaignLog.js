const { Router } = require('express');
const router = Router();
const LogController = require('../controllers/CampaignLog');
const auth = require('../middlewares/auth')

router.get('/', LogController.getLog)
router.post('/:CampaignId', auth.authentication, LogController.addLog)
router.delete('/:id', auth.authentication, LogController.deleteLog)
router.put('/:id', auth.authentication, LogController.editLog)
router.get('/:CampaignId/:page', LogController.findByCampaign)

module.exports = router;
