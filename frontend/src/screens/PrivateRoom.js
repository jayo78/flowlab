import React, { useState, useEffect } from "react";
// import io from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { joinRoom, leaveRoom } from "../actions/roomActions";
import Feed from "../components/Feed";

const PrivateRoomScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const participantJoin = useSelector((state) => state.participantJoin);
    const { participantInfo, error } = participantJoin;
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;
    const { roomID } = useParams();

    const handleSendMessage = (e) => {
        e.preventDefault();
        console.log("sending message");
    };

    const handleLeaveRoom = (e) => {
        e.preventDefault();
        console.log("leaving room");
        dispatch(leaveRoom(participantInfo.roomID, participantInfo._id));
    };

    const attemptJoinRoom = () => {
        console.log("room: " + roomID);
        if (userInfo) {
            console.log("joining authed");
            dispatch(joinRoom(roomID, userInfo._id, userInfo.name));
        } else {
            // join as anon (backend should generate random username)
            console.log("joining unauthed");
            dispatch(joinRoom(roomID, null, null));
        }
    };

    // on mount, attempt to join room or rejoin existing one
    useEffect(() => {
        if (!participantInfo) {
            console.log("attempting to join room");
            attemptJoinRoom();
        }
    }, []);

    useEffect(() => {
        // participantInfo null on leave or error
        if (!participantInfo) {
            if (error) {
                // error joining room
            }
            // redirect to dashboard if authed
            // redirect to welcome page if unauthed
            if (userInfo) navigate("/dashboard");
            else navigate("/welcome");
        } else {
            console.log("participant joined");
        }
    }, [participantInfo]);

    return (
        <div className="outerContainer">
            {participantInfo && (
                <div className="innerContainer">
                    <h3>In Room: {participantInfo.roomID}</h3>
                    <div>
                        <Feed roomID={participantInfo.roomID} socket={socket} />
                    </div>
                    <div>
                        <button onClick={handleSendMessage}>Send Message</button>
                        <button onClick={handleLeaveRoom}>Leave</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PrivateRoomScreen;
