import React from 'react';
import { Text, Flex, Box } from '@chakra-ui/react';

const Card = ({ participant }) => {
    if (participant) {
        return (
            <Flex w="full" direction="column" textAlign="center">
                <Box borderRadius="15px 15px 0 0 " bg="primary">
                    <Text color="white">{participant.name}</Text>
                </Box>
            </Flex>
        );
    } else {
        // null card
        return (
            <Flex w="full" direction="column" textAlign="center">
                <Box borderRadius="15px 15px 0 0 " bg="primary">
                    <Text color="white">null</Text>
                </Box>
            </Flex>
        );
    }
};
// <List wordBreak="break-word" overflowY="auto">

export default Card;
