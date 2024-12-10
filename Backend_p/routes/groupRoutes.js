const express = require('express');
const { getAllGroups, getGroupById, deleteGroup , getGroupDetails} = require('../controllers/groupController');
const router = express.Router();

router.get('/', getAllGroups);
router.get('/find', getGroupById);
router.delete('/delete', deleteGroup);
router.get('/details', getGroupDetails);

module.exports = router;
