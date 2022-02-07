import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { Flex, Grid, GridItem, Text, Box } from '@chakra-ui/react';
import { SocketContext } from '../socketContext';
import { useSelector } from 'react-redux';
import Loading from './Loading';
import Feed from './Feed';
// import Stats from './Stats';
import CardGallery from './CardGallery';

const Room = () => {
    const [loaded, setLoaded] = useState(false);
    const [participants, setParticipants] = useState([]);
    const socket = useContext(SocketContext);
    const participantJoin = useSelector((state) => state.participantJoin);
    const { participantInfo } = participantJoin;

    // get participants currently in the room
    const getParticipants = () => {
        console.log('[Room] getParticipants');
        axios
            .get('/api/rooms/' + participantInfo.roomID + '/participants')
            .then((res) => {
                console.log(res.data.participants);
                setParticipants(res.data.participants);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    // on mount join the room and jait for response
    useEffect(() => {
        console.log('[Room] mount');
        getParticipants();
        socket.emit('join', { participantInfo });

        socket.on('participantJoin', (participant) => {
            console.log('\tparticipant join');
            setParticipants((participants) => [...participants, participant]);
        });

        socket.on('participantLeave', (pID) => {
            console.log('\tparticipant leave ' + pID);
            setParticipants((participants) => {
                console.log(participants);
                return participants.filter((p) => p._id !== pID);
            });
        });

        socket.on('participantLoaded', () => {
            console.log('\tparticipant loaded');
            setLoaded(true);
        });

        // on unmount disconnect the socket
        return () => {
            socket.disconnect();
        };
    }, []);

    if (loaded && participants.length) {
        return (
            <Grid w="full" templateRows="repeat(4, 1fr)" templateColumns="repeat(4, 1fr)">
                <GridItem rowSpan={4} colSpan={1} bg="white">
                    <Box w="full" bg="primary">
                        <Text color="white" p={2} fontWeight="bold">
                            Stats
                        </Text>
                        <Box bg="white" h="200px"></Box>
                    </Box>
                    <Box w="full" bg="primary">
                        <Text color="white" p={2} fontWeight="bold">
                            Feed
                        </Text>
                    </Box>
                    <Feed />
                </GridItem>
                <GridItem m="auto" rowSpan={4} colSpan={3}>
                    <CardGallery participants={participants} />
                </GridItem>
            </Grid>
        );
    } else {
        return (
            <Flex mt={60} w="full" textAlign="center" direction="column" align="center">
                <Loading />
            </Flex>
        );
    }
};

export default Room;
