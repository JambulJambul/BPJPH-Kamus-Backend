const express = require('express');
const router = express.Router();
const {authenticate }  = require('../middleware/authMiddleware'); // Import authenticate middleware
const entryController = require('../controllers/entryController');

// Create a new entry
router.post('/', authenticate , entryController.createEntry);

// Get all 
router.get('/', entryController.getAllEntries);

// Get a single entry by ID
router.get('/:id', entryController.getEntryById);

// Update a entry by ID
router.put('/:id', authenticate ,entryController.updateEntry);

// Delete a entry by ID
router.delete('/:id', authenticate ,entryController.deleteEntry);

module.exports = router;
