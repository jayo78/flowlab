import React, { useEffect, useContext, useState } from 'react';
import {
    List,
    ListItem,
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
import ScrollableFeed from 'react-scrollable-feed';
import axios from 'axios';
import { SocketContext } from '../socketContext';
import { useSelector } from 'react-redux';
import Message from './Message';

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
            .get('/api/rooms/' + participantInfo.roomID + '/messages', config)
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
        console.log('[Feed] mount');
        // getMessages();
        socket.on('message', (data) => {
            let { content, participant, timestamp } = data;
            let { _id, name } = participant;
            console.log('\trecved message:');
            console.log('\tcontent: ' + content + ' from: ' + name + ' at: ' + timestamp);
            setMessages((messages) => [...messages, data]);
        });
    }, []);

    return (
        <Flex h="90vh" direction="column" justify="end">
            <ScrollableFeed wordBreak="break-word" maxH="100%" display="none">
                {messages &&
                    messages.map((data) => {
                        const { content, participant, timestamp } = data;
                        const { _id, name } = participant;
                        const isSelf = participantInfo._id == _id;
                        return (
                            <Box key={timestamp}>
                                <Message
                                    content={content}
                                    name={name}
                                    timestamp={new Date(timestamp).toLocaleTimeString('en-US')}
                                    isSelf={isSelf}
                                />
                            </Box>
                        );
                    })}
            </ScrollableFeed>
            <chakra.form onSubmit={handleSendMessage} p={2} mt={5} mb={7} w="full">
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
                            colorScheme="#E2E8F0"
                            onClick={handleSendMessage}>
                            <ArrowRightIcon />
                        </Button>
                    </InputRightElement>
                </FormControl>
            </chakra.form>
        </Flex>
    );
};
// <List wordBreak="break-word" overflowY="auto">

export default Feed;
