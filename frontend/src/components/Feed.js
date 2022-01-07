import React, { useEffect, useContext, useState } from 'react';
import {
    Flex,
    Box,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Button,
    Text,
    InputGroup,
    InputRightElement,
    Link,
    chakra
} from '@chakra-ui/react';
import axios from 'axios';
import { SocketContext } from '../socketContext';
import { useSelector } from 'react-router-dom';

const Feed = ({ roomID }) => {
    const socket = useContext(SocketContext);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    // get all messages from the room
    const getMessages = () => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        axios
            .post('/api/rooms/messages', { roomID: roomID }, config)
            .then((res) => {
                setMessages(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message) {
            console.log('sending message');
            socket.emit('sendMessage', message);
            setMessage('');
        }
    };

    // on mount get all previous messages and setup socket handlers
    useEffect(() => {
        // getMessages();
        socket.on('message', (message) => {
            console.log('recved message');
            setMessages((messages) => [...messages, message]);
        });
    }, []);

    return (
        <Flex height="100%" direction="column" justifyContent="end">
            <chakra.form onSubmit={handleSendMessage}>
                <FormControl>
                    <Input mb={5} type="text" placeholder="message"></Input>
                    <InputRightElement>
                        <Button>Send</Button>
                    </InputRightElement>
                </FormControl>
            </chakra.form>
        </Flex>
    );
};

export default Feed;
