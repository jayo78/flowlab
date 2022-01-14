import {
    ROOM_PARTICIPANT_SUCCESS,
    ROOM_PARTICIPANT_FAIL,
    ROOM_LEAVE
} from '../constants/roomConstants';

export const createParticipantReducer = (state = {}, action) => {
    switch (action.type) {
        case ROOM_PARTICIPANT_SUCCESS:
            return { participantInfo: action.payload };
        case ROOM_PARTICIPANT_FAIL:
            return { error: action.payload };
        case ROOM_LEAVE:
            return {};
        default:
            return state;
    }
};
