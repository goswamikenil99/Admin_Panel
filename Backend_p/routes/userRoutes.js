const express = require('express');
const { getAllUsers, getUserById, deleteUser , updatePassword , get_by_id , admin_login} = require('../controllers/userController');
const router = express.Router();

router.get('/', getAllUsers);
router.post('/find', getUserById);
router.post('/admin/login',admin_login);
router.delete('/delete', deleteUser);
router.put('/reset-password', updatePassword);
// router.post('/get_by_id', get_by_id);

module.exports = router;
