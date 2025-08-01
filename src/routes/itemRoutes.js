const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
} = require('../controllers/itemController');

router.use(auth);
router.get('/', getItems);
router.get('/:id', getItemById);
router.post('/', createItem);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);

module.exports = router;
