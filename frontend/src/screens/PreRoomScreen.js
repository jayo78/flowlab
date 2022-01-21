import React, { useEffect, useState } from 'react';
import {
    Text,
    Input,
    Button,
    Flex,
    Box,
    Link,
    FormControl,
    FormLabel
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createParticipant } from '../actions/roomActions';
import ErrorMessage from '../components/ErrorMessage';
import Loading from '../components/Loading';

const PreRoomScreen = () => {
    const [name, setName] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const participantJoin = useSelector((state) => state.participantJoin);
    const { participantInfo, error } = participantJoin;
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;
    const { roomID } = useParams();

    const handleJoinUnauthed = (e) => {
        console.log('[PreRoomScreen] handleJoinUnauthed');
        e.preventDefault();
        dispatch(createParticipant(roomID, null, name));
    };

    // on mount, attempt to create participant
    useEffect(() => {
        console.log('[PreRoomScreen] mount');
        if (!participantInfo) {
            if (userInfo) {
                console.log('\tsending createParticipant request');
                let userID = userInfo._id;
                let userName = userInfo.name;
                dispatch(createParticipant(roomID, userID, userName));
            }
        } else {
            console.log('\thave participantInfo - redirecting to room ' + roomID);
            navigate('/room/' + roomID);
        }
    }, [participantInfo]);

    if (error) {
        return (
            <Flex
                mt={60}
                textAlign="center"
                direction="column"
                justifyContent="center"
                align="center">
                <Box>
                    <ErrorMessage message={error} />
                    <Link href="/">Go Back</Link>
                </Box>
            </Flex>
        );
    } else {
        // prompt unauthed participant with name input
        if (!userInfo) {
            return (
                <Flex
                    position="fixed"
                    mt={50}
                    width="full"
                    align="center"
                    justifyContent="center">
                    <Box
                        m={8}
                        p={8}
                        maxWidth="500px"
                        borderWidth={1}
                        borderRadius={8}
                        boxShadow="lg">
                        <Box my={4} textAlign="left">
                            <form onSubmit={handleJoinUnauthed}>
                                <FormControl isRequired>
                                    <FormLabel mb={2}>Name</FormLabel>
                                    <Input
                                        type="text"
                                        placeholder="Name"
                                        size="lg"
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </FormControl>
                                <Button
                                    border="1px"
                                    borderColor="primary"
                                    variant="outline"
                                    type="submit"
                                    width="full"
                                    mt={4}>
                                    Join Room
                                </Button>
                            </form>
                            <Text mt={2} align="center" fontSize="xs">
                                {'Have an account? '}
                                <Link color="primary" href="login">
                                    Login
                                </Link>
                            </Text>
                        </Box>
                    </Box>
                </Flex>
            );
        } else {
            return (
                <Flex
                    mt={60}
                    textAlign="center"
                    direction="column"
                    justifyContent="center"
                    align="center">
                    <Box>
                        <Loading />
                    </Box>
                </Flex>
            );
        }
    }
};

export default PreRoomScreen;
