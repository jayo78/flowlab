import axios from "axios";
import { ROOM_LEAVE, ROOM_JOIN_FAIL, ROOM_JOIN_SUCCESS } from "../constants/roomConstants";

export const joinRoom = (roomID, userID, name) => (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    };

    axios
        .post("/api/rooms/join", { roomID, userID, name }, config)
        .then((res) => {
            dispatch({
                type: ROOM_JOIN_SUCCESS,
                payload: res.data,
            });

            localStorage.setItem("participantInfo", JSON.stringify(res.data));
        })
        .catch((error) => {
            if (error.response) {
                dispatch({
                    type: ROOM_JOIN_FAIL,
                    payload: error.response.data,
                });
            } else {
                console.log(error);
            }
        });
};

export const leaveRoom = (roomID, participantID) => (dispatch) => {
    localStorage.removeItem("participantInfo");
    dispatch({
        type: ROOM_LEAVE,
    });
};
