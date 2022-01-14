import React, { useEffect } from 'react';
import { Box, Flex, CircularProgress, Text } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createParticipant } from '../actions/roomActions';
import ErrorMessage from '../components/ErrorMessage';

const PreRoomScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const participantJoin = useSelector((state) => state.participantJoin);
    const { participantInfo, error } = participantJoin;
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;
    const { roomID } = useParams();

    // on mount, attempt to create participant
    useEffect(() => {
        console.log('[PreRoomScreen] mount');
        if (!participantInfo) {
            console.log('\tsending createParticipant request');
            // createParticipant as anon if no userInfo
            let userID = userInfo ? userInfo._id : null;
            let userName = userInfo ? userInfo.name : null;
            console.log('\troomID: ' + roomID + ' userID: ' + userID + ' name: ' + userName);

            dispatch(createParticipant(roomID, userID, userName));
        } else {
            console.log('\thave participantInfo - redirecting to room ' + roomID);
            navigate('/room/' + roomID);
        }
    }, [participantInfo]);

    return (
        <Box position="relative" width="100%" height="400">
            <Box position="absolute" top="50%" left="50%">
                {error && <ErrorMessage>{error}</ErrorMessage>}
                <CircularProgress isIndeterminate size="50px" color="teal" />
                <Text>Loading</Text>
            </Box>
        </Box>
    );
};

export default PreRoomScreen;
