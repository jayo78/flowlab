const {
    addParticipant,
    participantInRoom,
    removeParticipant,
    roomExists,
} = require('./rooms');
const Participant = require('./models/Participant');
const Room = require('./models/Room');

// TODO: add validation/auth as socket middleware
// NOTE: no error handling - implement (prob with callbacks) so client gets error
const validate = (roomID, participantID) => {
    console.log(
        '[IOHandler] validating participantID: ' + participantID + ' roomID: ' + roomID
    );

    if (!roomExists(roomID)) console.error("\troom doesn't exist");

    Participant.findOne({ _id: participantID }).then((participant) => {
        if (!participant) console.error('\tparticipant not found');
    });

    if (!participantInRoom(roomID, participantID)) console.error('\tparticipant not in room');
};

const handler = (socket) => {
    console.log('[IOHandler] client connected');

    socket.on('join', (data) => {
        console.log('[IOHandler] join');
        const { participantInfo } = data;
        const { _id, name, roomID } = participantInfo;

        if (!participantInRoom(roomID, _id)) {
            console.log('\tadding participant');
            addParticipant(roomID, _id);
        }

        validate(roomID, _id);
        socket.join(roomID);

        socket.roomID = roomID;
        socket.participantID = _id;
        socket.username = name;
        socket.emit('participantLoaded');
        console.log('\tparticipant loaded');
    });

    socket.on('sendMessage', (data) => {
        console.log('[IOHandler] sendMessage');
        const { message, participantInfo } = data;
        const { _id, name, roomID } = participantInfo;
        validate(roomID, _id);
        console.log('\t' + _id + ' sent message: ' + data + ' to room: ' + roomID);

        let room = Room.findOne({_id: roomID}).then((room) => {
            if (!room) {
                console.error("Room DNE but we try to push a message anyway");
            }
            room.messages.push({content: message, participant: _id});
            room.save().then(() => {
                // after saving, broadcast message to room
                socket.to(socket.roomID).emit('message', {
                    name: name,
                    message: message
                });
                socket.emit('message', {
                    name: name,
                    message: message
                });
                console.log('\tmessage broadcasted');
            });
        });
    });

    socket.on('disconnect', () => {
        // leave the room and remove it if there are no more participants
        console.log('[IOHandler] disconnected');
        socket.leave(socket.roomID);
        removeParticipant(socket.roomID, socket.participantID);
        // if (getRoom(socket.roomID).length <= 0) {
        // console.log('no more participants');
        // removeRoom(socket.roomID);
        // } else {
        // // broadcast leave
        // }
    });
};

module.exports = handler;
