import React, { useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../actions/userActions";

const DashboardScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;
    const participantJoin = useSelector((state) => state.participantJoin);
    const { participantInfo, error } = participantJoin;

    useEffect(() => {
        if (!userInfo) {
            console.log("logging out");
            navigate("/login");
        }
        // if participantInfo set then rejoin room
        if (participantInfo) {
            console.log("redirecting to room");
            navigate("/room/" + participantInfo.roomID);
        }
        if (error) console.log(error);
    }, [userInfo, participantInfo]);

    const handleLogout = (e) => {
        e.preventDefault();
        dispatch(logout());
    };

    const handleCreateRoom = (e) => {
        e.preventDefault();
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        axios
            .post("/api/rooms", { userID: userInfo._id }, config)
            .then((res) => {
                // NOTE: implicit join after room create
                // by navigating to new link
                let roomID = res.data._id;
                console.log("room created: " + roomID);
                navigate("/room/" + roomID);
            })
            .catch((error) => {
                if (error.response) {
                    console.log(error.response.data.message);
                } else {
                    console.log(error);
                }
            });
    };

    return (
        <section>
            {userInfo && <h3>Hello, {userInfo.name}</h3>}
            <button onClick={handleLogout}>Logout</button>
            <button onClick={handleCreateRoom}>Create Room</button>
        </section>
    );
};

export default DashboardScreen;
