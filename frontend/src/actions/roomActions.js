import axios from 'axios';
import {
    ROOM_LEAVE,
    ROOM_PARTICIPANT_FAIL,
    ROOM_PARTICIPANT_SUCCESS
} from '../constants/roomConstants';

// const callCreateParticipantAPI = async (roomID, userID, name) => {
// const config = {
// headers: {
// "Content-Type": "application/json",
// },
// };

// axios
// .post("/api/rooms/participants", { roomID, userID, name }, config)
// .then((res) => {
// return res.data;
// })
// .catch((error) => {
// throw Error(error.response.data);
// });
// };

export const createParticipant = (roomID, userID, name) => (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    axios
        .post('/api/rooms/participants', { roomID, userID, name }, config)
        .then((res) => {
            localStorage.setItem('participantInfo', JSON.stringify(res.data));

            dispatch({
                type: ROOM_PARTICIPANT_SUCCESS,
                payload: res.data
            });
        })
        .catch((error) => {
            dispatch({
                type: ROOM_PARTICIPANT_FAIL,
                payload:
                    error.response && error.response.data.message
                        ? error.response.data.message
                        : error.message
            });
        });
};

export const leaveRoom = (roomID, participantID) => (dispatch) => {
    localStorage.removeItem('participantInfo');
    dispatch({
        type: ROOM_LEAVE
    });
};
