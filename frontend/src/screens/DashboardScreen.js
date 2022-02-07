import React, { useEffect } from 'react';
import { Flex, Box, Button, Text } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../actions/userActions';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';

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

    // const getid = () => {
    // console.log("bruh");
    // console.log(userInfo.userID);
    // return userInfo._id + "";
    // }

    // const renderTasks = ()  => {
    // const userID = userInfo._id;
    // if (!userID) {
    // return;
    // }

    // // get user tasks
    // const tasksArr = userInfo.tasks;
    // // if tasks empty/null/undefined
    // if (!tasksArr) {
    // return (
    // <Box borderRadius='12px' border='2px' width='80%' align='center' textStyle='bold' height="300px">
    // <Text fontSize='2xl'>No tasks created!</Text>
    // </Box>
    // );
    // }
    // const taskObjs = tasksArr.map((taskID) => {
    // return axios
    // .get('/api/users/tasks/:' + taskID)
    // .then((res) => {
    // res.json()
    // })
    // })

    // return (
    // <HStack>
    // {taskObjs.map((task) => {
    // return <Box>
    // <Text fontSize='2xl'>{task.name}</Text>
    // <Text>{task.completed ? <CheckIcon /> : <CloseIcon />} :: {task.dateDeadline}</Text>
    // <Text>{task.description}</Text>
    // </Box>
    // })}
    // </HStack>
    // );
    // }

    return (
        <Box align="center" justifyContent="center" flexDir="column" height="100vh">
            <Box>
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
            </Box>
        </Box>
    );
};

export default DashboardScreen;
