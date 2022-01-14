import React, { useEffect } from 'react';
import { Text, Flex, Box, CircularProgress, Divider, Button, chakra } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { leaveRoom } from '../actions/roomActions';
import Room from '../components/Room';
import RoomNavBar from '../components/RoomNavBar';
import ErrorMessage from '../components/ErrorMessage';
import { SocketProvider } from '../socketContext';

const RoomScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { roomID } = useParams();
    const participantJoin = useSelector((state) => state.participantJoin);
    const { participantInfo, error } = participantJoin;

    useEffect(() => {
        console.log('[RoomScreen] mount');
        // participantInfo null on leave or error
        if (!participantInfo) {
            console.log('\tredirecting to /room/join/' + roomID);
            navigate('/room/join/' + roomID);
        }
    }, [participantInfo]);

    return (
        <Box>
            {participantInfo ? (
                <Flex position="fixed" direction="column" w="full" h="100vh">
                    <Flex flexGrow={0} flexShrink={1} flexBasis="auto">
                        <RoomNavBar />
                    </Flex>
                    <Flex flexGrow={1} flexShrink={1} flexBasis="auto" bg="#E5E5E5">
                        <SocketProvider>
                            <Room />
                        </SocketProvider>
                    </Flex>
                </Flex>
            ) : (
                <Box position="relative" width="100%" height="400">
                    <Box position="absolute" top="50%" left="50%">
                        {error && <ErrorMessage>{error}</ErrorMessage>}
                        <CircularProgress isIndeterminate size="50px" color="teal" />
                        <Text>Loading</Text>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default RoomScreen;
