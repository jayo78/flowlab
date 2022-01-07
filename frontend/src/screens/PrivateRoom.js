import React, { useState, useEffect } from 'react';
import {
    Flex,
    Box,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Divider,
    Button,
    Text,
    InputGroup,
    InputRightElement,
    Link,
    Spacer,
    chakra
} from '@chakra-ui/react';
import openSocket from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { joinRoom, leaveRoom } from '../actions/roomActions';
import Feed from '../components/Feed';
import { SocketProvider } from '../socketContext';

const PrivateRoomScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const participantJoin = useSelector((state) => state.participantJoin);
    const { participantInfo, error } = participantJoin;
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;
    const { roomID } = useParams();

    // const handleSendMessage = (e) => {
    // e.preventDefault();
    // console.log("sending message");
    // };

    const handleLeaveRoom = (e) => {
        e.preventDefault();
        console.log('leaving room');
        dispatch(leaveRoom(participantInfo.roomID, participantInfo._id));
    };

    const attemptJoinRoom = () => {
        console.log('room: ' + roomID);
        if (userInfo) {
            console.log('joining authed');
            dispatch(joinRoom(roomID, userInfo._id, userInfo.name));
        } else {
            // join as anon (backend should generate random username)
            console.log('joining unauthed');
            dispatch(joinRoom(roomID, null, null));
        }
    };

    // on mount, attempt to join room or rejoin existing one
    useEffect(() => {
        if (!participantInfo) {
            console.log('attempting to join room');
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
            if (userInfo) navigate('/dashboard');
            else navigate('/welcome');
        }
    }, [participantInfo]);

    return (
        <Flex bg="red" justify-content="center" align="center">
            {participantInfo && (
                <Flex
                    direction="column"
                    height="100%"
                    width="25%"
                    position="fixed"
                    top="0"
                    left="0">
                    <Box height="25%">
                        <chakra.h3>In Room: {participantInfo.roomID}</chakra.h3>
                    </Box>
                    <Divider />
                    <Box height="75%">
                        <SocketProvider>
                            <Feed />
                        </SocketProvider>
                    </Box>
                    <Button colorScheme="red" borderRadius="0" onClick={handleLeaveRoom}>
                        Leave
                    </Button>
                </Flex>
            )}
        </Flex>
    );
};

export default PrivateRoomScreen;
