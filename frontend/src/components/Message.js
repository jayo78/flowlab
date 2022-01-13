import React, { useEffect, useContext, useState } from 'react';
import {
    Box,
    Flex,
    Text,
    FormControl,
    Input,
    Button,
    InputRightElement,
    Spacer,
    chakra
} from '@chakra-ui/react';
import { ArrowRightIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { SocketContext } from '../socketContext';
import { useSelector } from 'react-redux';

const Message = ({ content, timestamp, name, isSelf }) => {
    return (
        <Box>
            <Box>
                {name}
                {timestamp}
            </Box>
            <Box>{content}</Box>
        </Box>
    );
};

export default Message;
