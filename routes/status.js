const { Router } = require('express');
const router = Router();
const StatusController = require('../controllers/Status');

router.get('/', StatusController.getStatus)
router.post('/', StatusController.addStatus)

module.exports = router;