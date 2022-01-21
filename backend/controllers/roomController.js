const User = require("../models/User");
const Participant = require("../models/Participant");
const Room = require("../models/Room");
const Message = require("../models/Message");
const { addRoom, addParticipant, roomHasSpace, roomExists, getOpenRoom } = require("../rooms");

/*
 * create room is only hit by users and not used when the backend itself is spinning up rooms.
 * rooms created by users should always be private
 * */
const createRoom = async (req, res) => {
    console.log("[roomController] createRoom");
    let { userID } = req.body;

    //roomID
    // validate
    const userExists = await User.findOne({ _id: userID });
    if (!userExists) {
        console.error("\tcreateRoom: user not found");
        return res.status(400).json({ message: "user not found" });
    }

    //
    // create the room, add to map, and then return it
    Room.create({
        creator_id: userID,
        type: "private",
    }).then((newRoom) => {
        console.log("\troom created: " + newRoom._id);
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
    console.log("[roomController] createParticipant");
    let { roomID, userID, name } = req.body;

    // validate
    if (!roomExists(roomID)) {
        console.error("\troom not found");
        return res.status(400).json({ message: "room not found" });
    }

    if (!roomHasSpace(roomID)) {
        console.error("\troom full");
        return res.status(400).json({ message: "room full" });
    }

    if (userID) {
        // only check user if it is provided
        const userExists = await User.findOne({ _id: userID });
        if (!userExists) {
            console.error("\tuser not found");
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
        console.log("\tparticipant created: " + newParticipant._id);
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
const findRoom = async (_req, res) => {
    console.log("[roomController] findRoom");

    let roomID = getOpenRoom();
    if (!roomID) {
        // no open rooms
        Room.create({
            creator_id: null,
            type: "public",
        }).then((newRoom) => {
            console.log("\troom created: " + newRoom._id);
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

const getMessages = async (req, res) => {
    console.log("[roomController] getMessages");

    let roomID = req.params.roomID;

    let room = await Room.findOne({ _id: roomID });
    if (!room) {
        console.log("getMessages failed, unrecognized roomID");
        return res.status(404);
    }

    let messages = await Message.find({ _id: { $in: room.messages } }).populate("participant");

    return res.status(200).json({
        messages: messages,
    });
};

module.exports = {
    createRoom,
    createParticipant,
    findRoom,
    getMessages,
};
