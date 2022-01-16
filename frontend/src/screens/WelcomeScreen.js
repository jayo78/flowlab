import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { leaveRoom } from '../actions/roomActions';
import NavBar from '../components/NavBar';
import { Heading, Button, HStack, Flex, Box, Text } from '@chakra-ui/react';

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
        <Box>
            <NavBar />
            <Box pt="60px" position="relative" overflow="hidden" display="block">
                <Flex
                    minHeight="160px"
                    flexWrap="wrap"
                    maxWidth="1380px"
                    flexDirection="column"
                    borderRadius="md"
                    p={0}
                    m="auto"
                    boxSizing="border-box"
                    textAlign="center"
                    justifyContent="space-between"
                    alignItems="center">
                    <Heading whiteSpace="pre-line" fontSize="60px" lineHeight="64px">
                        GenZ Co-working Space
                    </Heading>
                    <Box>
                        <Text
                            lineHeight="28px"
                            px={24}
                            wordBreak="break-word"
                            color="grey"
                            fontSize="14">
                            velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                            mollit est laborum.
                        </Text>
                    </Box>
                    <HStack pt="20px" display="flex" justify="center" spacing={2} w="full">
                        <Button px={10} color="white" bg="primary">
                            asdf
                        </Button>
                        <Button
                            px={10}
                            border="1px"
                            borderColor="primary"
                            variant="ghost"
                            mr={2}>
                            asdf
                        </Button>
                    </HStack>
                </Flex>
            </Box>
        </Box>
    );
};

export default WelcomeScreen;
