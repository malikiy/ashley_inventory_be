const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getItemReport,
  exportItemReportCSV
} = require('../controllers/itemController');

router.use(auth);
router.get('/', getItems);
router.get('/report', getItemReport);
router.get('/:id', getItemById);
router.post('/', createItem);
router.post('/export-report', exportItemReportCSV);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);

module.exports = router;
