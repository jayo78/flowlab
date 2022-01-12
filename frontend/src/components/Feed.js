import React, { useEffect, useContext, useState } from "react";
import { Flex, FormControl, Input, Button, InputRightElement, chakra } from "@chakra-ui/react";
import axios from "axios";
import { SocketContext } from "../socketContext";
import { useSelector } from "react-redux";

const Feed = () => {
    const socket = useContext(SocketContext);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    const participantJoin = useSelector((state) => state.participantJoin);
    const { participantInfo } = participantJoin;

    // get all messages from the room
    const getMessages = () => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
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
        if (message) {
            console.log("sending message");
            socket.emit("sendMessage", { message, participantInfo });
            setMessage("");
        }
    };

    // on mount get all previous messages and setup socket handlers
    useEffect(() => {
        getMessages();
        socket.on("message", (data) => {
            console.log("recved message" + data);
            // setMessages((messages) => [...messages, data]);
        });
    }, []);hello
        <Flex height="100%" direction="column" justifyContent="end">
            <chakra.form onSubmit={handleSendMessage}>
                <FormControl>
                    <Input
                        mb={5}
                        type="text"
                        placeholder="message"
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <InputRightElement>
                        <Button onClick={handleSendMessage}>Send</Button>
                    </InputRightElement>
                </FormControl>
            </chakra.form>
        </Flex>
    );
};

export default Feed;
