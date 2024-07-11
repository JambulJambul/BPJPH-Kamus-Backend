const express = require('express');
const router = express.Router();
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');


router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/check-admin', userController.checkAdmin);
router.post('/check-token', userController.checkToken);

router.get('/', authenticate, authorizeAdmin, userController.getAllUsers);
router.get('/count', authenticate, authorizeAdmin, userController.getUserCount);
router.put('/:id', authenticate, userController.updateUser);
router.put('/change-role/:id', authenticate, authorizeAdmin, userController.changeUserRole);
router.delete('/:id', userController.deleteUser);
// router.get('/:id', authenticate, authorizeAdmin, userController.getUserById);
// router.put('/forgotPassword/:email', userController.forgotPassword);

module.exports = router;