const {Router} = require('express');
const router = Router();
const categoryController = require('../controllers/Category');
const auth = require('../middlewares/auth');
const {uploader} = require('../middlewares/multer');

router.get('/', categoryController.getAllCategory);
router.post('/add', uploader.single('image'), categoryController.addCategory);
router.put('/edit/:id', uploader.single('image'), categoryController.editCategory);
router.delete('/delete/:id', categoryController.deleteCategory);

module.exports = router;
