import React, { useEffect, useContext, useState } from 'react';
import {
    Box,
    Flex,
    FormControl,
    Input,
    Button,
    InputRightElement,
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
        console.log('[Feed] getMessages');
        axios
            .get('/api/rooms/' + participantInfo.roomID + '/messages')
            .then((res) => {
                console.log(res.data.messages);
                setMessages(res.data.messages);
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
        getMessages();
        socket.on('message', (data) => {
            let { content, participant, createdAt } = data;
            let { _id, name } = participant;
            console.log('\trecved message:');
            console.log('\tcontent: ' + content + ' from: ' + name + ' at: ' + createdAt);
            setMessages((messages) => [...messages, data]);
        });
    }, []);

    return (
        <Flex h="90vh" direction="column" justify="end">
            <ScrollableFeed wordBreak="break-word" maxH="100%" display="none">
                {messages &&
                    messages.map((data) => {
                        const { content, participant, createdAt } = data;
                        const { _id, name } = participant;
                        const isSelf = participantInfo._id == _id;
                        return (
                            <Box key={createdAt}>
                                <Message
                                    content={content}
                                    name={name}
                                    createdAt={new Date(createdAt).toLocaleTimeString('en-US')}
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
                            p={1}
                            bg="transparent"
                            color="primary"
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
