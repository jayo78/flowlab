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

const Feed = () => {
    const socket = useContext(SocketContext);
    const [messageContent, setMessageContent] = useState('');
    const [messages, setMessages] = useState([]);

    const participantJoin = useSelector((state) => state.participantJoin);
    const { participantInfo } = participantJoin;

    // get all messages from the room
    const getMessages = () => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        axios
            .get("/api/rooms/" + participantInfo.roomID + "/messages", config)
            .then((res) => {
                setMessages(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (messageContent) {
            console.log('sending message');
            socket.emit('sendMessage', { messageContent, participantInfo });
            setMessageContent('');
        }
    };

    // on mount get all previous messages and setup socket handlers
    useEffect(() => {
        // getMessages();
        socket.on('message', (data) => {
            console.log('recved message' + data);
            setMessages((messages) => [...messages, data]);
        });
    }, []);

    return (
        <Flex p={2} height="100%" direction="row" align="end">
            <chakra.form onSubmit={handleSendMessage} mb={5} w="full">
                <FormControl>
                    <Input
                        value={messageContent}
                        type="text"
                        placeholder="message"
                        onChange={(e) => setMessageContent(e.target.value)}
                    />
                    <InputRightElement>
                        <Button
                            variant="ghost"
                            p={1}
                            colorScheme="purple"
                            onClick={handleSendMessage}>
                            <ArrowRightIcon />
                        </Button>
                    </InputRightElement>
                </FormControl>
            </chakra.form>
        </Flex>
    );
};

export default Feed;
