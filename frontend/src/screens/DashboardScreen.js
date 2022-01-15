import React, { useEffect } from 'react';
import { Flex, Box, Button } from '@chakra-ui/react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../actions/userActions';

const DashboardScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;
    const participantJoin = useSelector((state) => state.participantJoin);
    const { participantInfo, error } = participantJoin;

    useEffect(() => {
        console.log('[DashboardScreen] mount');
        if (!userInfo) {
            console.log('\tlogging out');
            navigate('/login');
        }
        // if participantInfo set then rejoin room
        if (participantInfo) {
            console.log('\tredirecting to room');
            navigate('/room/' + participantInfo.roomID);
        }
        if (error) console.error('\terror: ' + error);
    }, [userInfo, participantInfo]);

    const handleLogout = (e) => {
        e.preventDefault();
        dispatch(logout());
    };

    const handleJoinRoom = (e) => {
        console.log('[DashboardScreen] handleJoinRoom');
        e.preventDefault();
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        console.log('\tsending findRoom request');
        axios.get('/api/rooms/').then((res) => {
            let roomID = res.data.roomID;
            console.log('\tgot room ' + roomID);
            navigate('/room/' + res.data.roomID);
        });
    };

    const handleCreateRoom = (e) => {
        console.log('[DashboardScreen] handleCreateRoom');
        e.preventDefault();
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        console.log('\tsending createRoom request');
        axios
            .post('/api/rooms', { userID: userInfo._id }, config)
            .then((res) => {
                // NOTE: implicit join after room create
                // by navigating to new link
                let roomID = res.data._id;
                console.log('\troom created: ' + roomID);
                navigate('/room/' + roomID);
            })
            .catch((error) => {
                let errMsg =
                    error.response && error.response.data.message
                        ? error.response.data.message
                        : error.message;
                console.log('\terror: ' + errMsg);
            });
    };

    return (
        <Flex align="center" justifyContent="center">
            <Box p={8} color="white">
                <Button bg="secondary" m={2} onClick={handleLogout}>
                    Logout
                </Button>
                <Button bg="primary" m={2} onClick={handleCreateRoom}>
                    Create Room
                </Button>
                <Button bg="primary" m={2} onClick={handleJoinRoom}>
                    Join Room
                </Button>
            </Box>
        </Flex>
    );
};

export default DashboardScreen;
