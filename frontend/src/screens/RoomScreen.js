import React, { useEffect } from "react";
import { Flex, Box, Divider, Button, chakra } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { leaveRoom } from "../actions/roomActions";
import Room from "../components/Room";
import { SocketProvider } from "../socketContext";

const RoomScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { roomID } = useParams();
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;
    const participantJoin = useSelector((state) => state.participantJoin);
    const { participantInfo, error } = participantJoin;

    const handleLeaveRoom = (e) => {
        e.preventDefault();
        console.log("leaving room");
        dispatch(leaveRoom(participantInfo.roomID, participantInfo._id));
        navigate("/");
    };

    useEffect(() => {
        // participantInfo null on leave or error
        if (!participantInfo) {
            console.log("no participantInfo");
            // redirect to dashboard if authed else join
            navigate("/room/join/" + roomID);
        }
    }, [participantInfo]);

    return (
        <Flex bg="blue" justify-content="center" align="center">
            {participantInfo && (
                <Flex
                    direction="column"
                    height="100%"
                    width="25%"
                    position="fixed"
                    top="0"
                    left="0"
                >
                    <Box height="25%">
                        <chakra.h3>In Room: {participantInfo.roomID}</chakra.h3>
                    </Box>
                    <Divider />
                    <Box height="75%">
                        <SocketProvider>
                            <Room />
                        </SocketProvider>
                    </Box>
                    <Button colorScheme="red" borderRadius="0" onClick={handleLeaveRoom}>
                        Leave
                    </Button>
                </Flex>
            )}
        </Flex>
    );
};

export default RoomScreen;
