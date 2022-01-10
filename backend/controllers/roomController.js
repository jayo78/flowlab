const User = require("../models/User");
const Participant = require("../models/Participant");
const Room = require("../models/Room");
const {
    addRoom,
    addParticipant,
    roomHasSpace,
    roomExists,
    getOpenRoom,
    removeRoom,
    removeParticipant,
    participantInRoom,
} = require("../rooms");

/*
 * create room is only hit by users and not used when the backend itself is spinning up rooms.
 * rooms created by users should always be private
 * */
const createRoom = async (req, res) => {
    console.log("[Controller] createRoom");
    let { userID } = req.body;

    //
    // validate
    const userExists = await User.findOne({ _id: userID });
    if (!userExists) {
        console.log("[Controller] createRoom: user not found");
        return res.status(400).json({ message: "user not found" });
    }

    //
    // create the room, add to map, and then return it
    Room.create({
        creator_id: userID,
        type: "private",
    }).then((newRoom) => {
        console.log("[Controller] room created");
        console.log(newRoom);
        addRoom(newRoom._id.toString());
        return res.status(201).json({
            _id: newRoom._id.toString(),
            creator_id: newRoom.creator_id,
            type: newRoom.type,
        });
    });
};

// can create anon participant or reference an authed user
const createParticipant = async (req, res) => {
    console.log("[Controller] createParticipant");
    let { roomID, userID, name } = req.body;

    //
    // validate
    if (!roomExists(roomID)) {
        console.log("[Controller] room not found");
        return res.status(400).json({ message: "room not found" });
    }

    if (!roomHasSpace(roomID)) {
        console.log("[Controller] room full");
        return res.status(400).json({ message: "room full" });
    }

    if (userID) {
        // only check user if it is provided
        const userExists = await User.findOne({ _id: userID });
        if (!userExists) {
            console.log("[Controller] user not found");
            return res.status(400).json({ message: "user not found" });
        }
    }

    //
    // create the participant, add to map, and then return it
    Participant.create({
        name: name,
        anon: userID == null,
        roomID: roomID,
        userID: userID,
    }).then((newParticipant) => {
        console.log("participant created");
        console.log(newParticipant);
        addParticipant(roomID, newParticipant._id.toString());
        return res.status(201).json({
            _id: newParticipant._id.toString(),
            name: newParticipant.name,
            anon: newParticipant.anon,
            roomID: newParticipant.roomID,
            userID: newParticipant.userID,
        });
    });
};

// find an open room or create a new one
const findRoom = async (req, res) => {
    console.log("[Controller] findRoom");

    let roomID = getOpenRoom();
    if (!roomID) {
        // no open rooms
        Room.create({
            creator_id: null,
            type: "public",
        }).then((newRoom) => {
            console.log("[Controller] room created");
            console.log(newRoom);
            addRoom(newRoom._id.toString());
            return res.status(201).json({
                roomID: newRoom._id.toString(),
            });
        });
    } else {
        return res.status(201).json({
            roomID: roomID,
        });
    }
};

module.exports = {
    createRoom,
    createParticipant,
    findRoom,
};
