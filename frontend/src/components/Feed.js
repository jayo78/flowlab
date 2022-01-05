import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-router-dom";

const Feed = ({ socket, roomID }) => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    // get all messages from the room
    const getMessages = () => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        axios
            .post("/api/rooms/messages", { roomID: roomID }, config)
            .then((res) => {
                setMessages(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const sendMessage = (e) => {
        e.preventDefault();

        if (message) {
            socket.emit("sendMessage", message);
            setMessage("");
        }
    };

    // on mount get all previous messages and setup socket handlers
    useEffect(() => {
        getMessages();
        socket.on("message", (message) => {
            console.log("recved message");
            setMessages((messages) => [...messages, message]);
        });
    }, []);

    return (
        <p>feed</p>
        // <div>
        // <div>
        // <div>
        // {messages.map((message, i) => (
        // <div key={i}>
        // <p>{message}</p>
        // </div>
        // )}
        // </div>
        // </div>
        // </div>
    );
};

export default Feed;
