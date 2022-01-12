const express = require('express');
const router = express.Router();
const { 
    createRoom, 
    findRoom, 
    createParticipant, 
    getMessages 
} = require('../controllers/roomController');

router.route('/').post(createRoom).get(findRoom);
router.post('/participants', createParticipant);
router.get('/:roomID/messages', getMessages)

module.exports = router;
