import React, { useEffect, useContext, useState } from 'react';
import { Grid, GridItem, Text, Flex, Box } from '@chakra-ui/react';
import { SocketContext } from '../socketContext';
import { useSelector } from 'react-redux';
import Feed from './Feed';

const Room = () => {
    const [loaded, setLoaded] = useState(false);
    const socket = useContext(SocketContext);
    const participantJoin = useSelector((state) => state.participantJoin);
    const { participantInfo } = participantJoin;

    // on mount join the room and wait for response
    useEffect(() => {
        socket.emit('join', { participantInfo });
        socket.on('participantLoaded', (data) => {
            console.log('\tparticipant loaded');
            setLoaded(true);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    if (loaded) {
        return (
            <Grid w="full" templateRows="repeat(4, 1fr)" templateColumns="repeat(4, 1fr)">
                <GridItem rowSpan={4} colSpan={1} backgroundColor="white">
                    <Feed />
                </GridItem>
            </Grid>
        );
    } else {
        return (
            <Box position="relative" width="100%" height="400">
                <Box position="absolute" top="50%" left="50%">
                    <Text>Loading</Text>
                </Box>
            </Box>
        );
    }
};

export default Room;
