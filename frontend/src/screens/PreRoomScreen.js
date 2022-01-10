import React, { useEffect } from "react";
import { Flex, Text } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { createParticipant } from "../actions/roomActions";

const PreRoomScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const participantJoin = useSelector((state) => state.participantJoin);
    const { participantInfo, error } = participantJoin;
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;
    const { roomID } = useParams();

    // on mount, attempt to create participant
    useEffect(() => {
        console.log("[PreRoomScreen]");
        if (!participantInfo) {
            console.log("attempting to create a participant");
            // createParticipant as anon if no userInfo
            let userID = userInfo ? userInfo._id : null;
            let userName = userInfo ? userInfo.name : null;
            console.log("createParticipant: " + roomID + " " + userID + " " + userName);

            dispatch(createParticipant(roomID, userID, userName));
        }
    }, []);

    useEffect(() => {
        if (participantInfo) {
            navigate("/room/" + roomID);
        }
    }, [participantInfo]);

    return (
        <Flex>
            {error && <Text color="red">error</Text>}
            <Text>Loading</Text>
        </Flex>
    );
};

export default PreRoomScreen;
