import { ROOM_JOIN_SUCCESS, ROOM_JOIN_FAIL, ROOM_LEAVE } from "../constants/roomConstants";

export const joinRoomReducer = (state = {}, action) => {
    switch (action.type) {
        case ROOM_JOIN_SUCCESS:
            return { participantInfo: action.payload };
        case ROOM_JOIN_FAIL:
            return { error: action.payload };
        case ROOM_LEAVE:
            return {};
        default:
            return state;
    }
};
