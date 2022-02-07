import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    chakra,
    Flex,
    Link,
    useColorModeValue,
    VisuallyHidden,
    HStack,
    Button
} from '@chakra-ui/react';

const NavBar = () => {
    const bg = useColorModeValue('white', 'gray.800');
    const navigate = useNavigate();

    const handleJoinRoom = (e) => {
        console.log('[NavBar] handleJoinRoom');
        e.preventDefault();

        console.log('\tsending findRoom request');
        axios.get('/api/rooms/').then((res) => {
            let roomID = res.data.roomID;
            console.log('\tgot room ' + roomID);
            navigate('/room/' + res.data.roomID);
        });
    };

    return (
        <chakra.header bg={bg} w="full" px={{ base: 2, sm: 4 }} py={4}>
            <Flex alignItems="center" justifyContent="space-between" mx="auto">
                <Flex>
                    <chakra.a
                        href="/"
                        title="Flowlab Welcome Page"
                        display="flex"
                        alignItems="center">
                        <VisuallyHidden>FlowLab</VisuallyHidden>
                    </chakra.a>
                    <chakra.h1 fontSize="xl" fontWeight="medium" ml="2">
                        FlowLab
                    </chakra.h1>
                </Flex>

                <HStack display="flex" alignItems="center" spacing={1}>
                    <HStack
                        spacing={1}
                        mr={1}
                        color="black.500"
                        display={{ base: 'none', md: 'inline-flex' }}>
                        <Link>
                            <Button variant="ghost">How It Works</Button>
                        </Link>
                        <Link>
                            <Button variant="ghost">About</Button>
                        </Link>
                        <Link href="login">
                            <Button variant="ghost">Sign In</Button>
                        </Link>
                    </HStack>
                    <Button color="white" bg="#6c75f1" size="sm" onClick={handleJoinRoom}>
                        Start Flow
                    </Button>
                </HStack>
            </Flex>
        </chakra.header>
    );
};

export default NavBar;
