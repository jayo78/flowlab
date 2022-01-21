import React, { useEffect, useContext, useState } from 'react';
import { Flex, Grid, GridItem, Text, Box } from '@chakra-ui/react';
import { SocketContext } from '../socketContext';
import { useSelector } from 'react-redux';
import Loading from './Loading';
import Feed from './Feed';

const Room = () => {
    const [loaded, setLoaded] = useState(false);
    const socket = useContext(SocketContext);
    const participantJoin = useSelector((state) => state.participantJoin);
    const { participantInfo } = participantJoin;

    // on mount join the room and wait for response
    useEffect(() => {
        socket.emit('join', { participantInfo });
        socket.on('participantLoaded', () => {
            console.log('\tparticipant loaded');
            setLoaded(true);
        });

        // on unmount disconnect the socket
        return () => {
            socket.disconnect();
        };
    }, []);

    if (loaded) {
        return (
            <Grid w="full" templateRows="repeat(4, 1fr)" templateColumns="repeat(4, 1fr)">
                <GridItem rowSpan={4} colSpan={1} backgroundColor="white">
                    <Box w="full" bg="primary">
                        <Text color="white" p={2} fontWeight="bold">
                            Feed
                        </Text>
                    </Box>
                    <Feed />
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
