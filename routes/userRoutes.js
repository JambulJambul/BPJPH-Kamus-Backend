const express = require('express');
const router = express.Router();
const {authenticate}  = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/check-admin', userController.checkAdmin);

router.get('/', authenticate , userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.put('/forgotPassword/:email', userController.forgotPassword);
router.delete('/:id', userController.deleteUser);

module.exports = router;