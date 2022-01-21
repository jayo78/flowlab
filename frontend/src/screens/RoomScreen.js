import React, { useEffect } from 'react';
import { Flex, Box, Link } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import Room from '../components/Room';
import RoomNavBar from '../components/RoomNavBar';
import ErrorMessage from '../components/ErrorMessage';
import Loading from '../components/Loading';
import { SocketProvider } from '../socketContext';

const RoomScreen = () => {
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
                <Flex mt={60} direction="column" justifyContent="center" align="center">
                    {error ? (
                        <Box>
                            <ErrorMessage message={error} />
                            <Link href="/">Go Back</Link>
                        </Box>
                    ) : (
                        <Loading />
                    )}
                </Flex>
            )}
        </Box>
    );
};

export default RoomScreen;
