const express = require('express');
const router = express.Router();
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');
const entryController = require('../controllers/entryController');
const { upload } = require('../utils/imageUpload')

router.post('/', authenticate, upload.single('img'), entryController.createEntry);

router.get('/', entryController.getAllEntries);

router.get('/:id', entryController.getEntryById);

router.put('/:id', authenticate, entryController.updateEntry);

router.put('/status/:id', authenticate, authorizeAdmin, entryController.setEntryStatus);

router.delete('/:id', authenticate, entryController.deleteEntry);

module.exports = router;