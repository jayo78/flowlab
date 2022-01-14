import React from 'react';
import { Box, Flex } from '@chakra-ui/react';

const Message = ({ content, timestamp, name, isSelf }) => {
    return (
        <Box p={2} bg={isSelf ? '#F7FAFC' : 'white'} fontSize="14">
            <Flex justify="space-between">
                <Box fontWeight="bold">{name}</Box>
                <Box fontSize="11" color="grey">
                    {timestamp}
                </Box>
            </Flex>
            <Box wordBreak="break-word">{content}</Box>
        </Box>
    );
};

export default Message;
