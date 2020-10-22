const { Router } = require('express');
const router = Router();
const CommentController = require('../controllers/UserComment');
const auth = require('../middlewares/auth');

router.get('/', CommentController.getComment)
router.post('/add/:id', auth.authentication,CommentController.addComment)
router.delete('/:id', auth.authentication,CommentController.deleteComment)
router.put('/:id', auth.authentication,CommentController.editComment)
router.get('/:CampaignId', CommentController.allComment)
router.get('/:CampaignId/:page', CommentController.findByCampaign)


module.exports = router;
