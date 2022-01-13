import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { leaveRoom } from '../actions/roomActions';
import NavBar from '../components/NavBar';
import { Box } from '@chakra-ui/layout';

const WelcomeScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;
    const participantJoin = useSelector((state) => state.participantJoin);
    const { participantInfo, error } = participantJoin;

    useEffect(() => {
        console.log('[WelcomeScreen] mount');
        if (participantInfo) {
            console.log('\tparticipantInfo still loaded - dispatch leaveRoom');
            dispatch(leaveRoom(participantInfo.roomID, participantInfo._id));
        }
        if (userInfo) {
            console.log('\tuserInfo loaded - redirect to dashboard');
            navigate('/dashboard');
        }
    }, []);

    return (
        <Box >
        <NavBar />
            <Box bg="tomato" borderRadius="md" justify-content="center" align="center" mt="60px" ml="100px" mr="100px" p="15px">
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                sed do eiusmod tempor incididunt ut labore et dolore magna
                aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                ullamco laboris nisi ut aliquip ex ea commodo consequat.
                Duis aute irure dolor in reprehenderit in voluptate velit
                esse cillum dolore eu fugiat nulla pariatur. Excepteur
                sint occaecat cupidatat non proident, sunt in culpa qui
                officia deserunt mollit anim id est laborum.
            </p>
            </Box>
        </Box>
    );
};

export default WelcomeScreen;
