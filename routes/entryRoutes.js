const express = require('express');
const router = express.Router();
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');
const entryController = require('../controllers/entryController');
const { upload } = require('../utils/imageUpload')

router.post('/', authenticate, upload.single('img'), entryController.createEntry);

router.get('/', entryController.getAllEntries);

router.get('/count', authenticate, authorizeAdmin, entryController.getEntryCount);

router.get('/:id', entryController.getEntryById);

router.get('/entry/personal', authenticate, entryController.getEntryByUserId);

router.put('/:id', authenticate, upload.single('img'), entryController.updateEntry);

router.put('/status/:id', authenticate, authorizeAdmin, entryController.setEntryStatus);

router.delete('/:id', authenticate, entryController.deleteEntry);

module.exports = router;