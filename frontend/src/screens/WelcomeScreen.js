import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { leaveRoom } from "../actions/roomActions";
import NavBar from "../components/NavBar";

const WelcomeScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;
    const participantJoin = useSelector((state) => state.participantJoin);
    const { participantInfo, error } = participantJoin;

    useEffect(() => {
        if (participantInfo) {
            dispatch(leaveRoom(participantInfo.roomID, participantInfo._id));
        }
        if (userInfo) {
            navigate("/dashboard");
        }
    }, []);

    return <NavBar />;
};

export default WelcomeScreen;
