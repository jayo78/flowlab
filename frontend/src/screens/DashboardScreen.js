import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../actions/userActions";

const DashboardScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const handleLogout = (e) => {
        e.preventDefault();
        dispatch(logout())
    }

    useEffect(() => {
        console.log("userInfo updated")
        if (!userInfo) {
            navigate("/login");
        }
    }, [userInfo]);

    return (
        <section>
            {userInfo && <h3>Hello, {userInfo.name}</h3>}
            <button onClick={handleLogout}>
                Logout
            </button>
            
        </section>
    );
}

export default DashboardScreen;