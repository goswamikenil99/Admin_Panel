const express = require('express');
const { getAllMessages, getMessageById, deleteMessage ,getAllMessagesWithUserDetails} = require('../controllers/messageController');
const router = express.Router();

router.get('/', getAllMessages);
router.get('/find', getMessageById);
router.delete('/delete', deleteMessage);
router.get('/kenil', getAllMessagesWithUserDetails);

module.exports = router;
