import React, { useEffect, useContext, useState } from "react";
import { Flex } from "@chakra-ui/react";
import { SocketContext } from "../socketContext";
import { useSelector } from "react-redux";
import Feed from "./Feed";

const Room = () => {
    const [loaded, setLoaded] = useState(false);
    const socket = useContext(SocketContext);
    const participantJoin = useSelector((state) => state.participantJoin);
    const { participantInfo } = participantJoin;

    // on mount join the room and wait for response
    useEffect(() => {
        socket.emit("join", { participantInfo });
        socket.on("participantLoaded", (data) => {
            console.log("participant loaded");
            setLoaded(true);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return <Flex bg="red">{loaded && <Feed />}</Flex>;
};

export default Room;
