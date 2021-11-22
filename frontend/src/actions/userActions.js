import axios from "axios"; import { 
    USER_REGISTER_FAIL, 
    USER_REGISTER_SUCCESS, 
    USER_LOGIN_FAIL, 
    USER_LOGIN_SUCCESS,
    USER_LOGOUT
} from "../constants/userConstants";

// try to log in with email and password
// if success then set userInfo in browser to persist user login for future visits
export const login = (email, password) => dispatch => {
    
    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    };

    axios.post(
        "/api/users/login", 
        { email, password }, 
        config
    )
    .then(res => {
        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: res.data
        });

        localStorage.setItem("userInfo", JSON.stringify(res.data));
    })
    .catch(error => {
        if (error.response) {
            dispatch({
                type: USER_LOGIN_FAIL,
                payload: error.response.data
            });
        } else {
            console.log(error);
        }
    });
}

// try to register a user
// if successful log them in
export const register = (email, password, name) => dispatch => {

    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    };

    axios.post(
        "/api/users",
        {email, password, name},
        config
    )
    .then(res => {
        dispatch({
            type: USER_REGISTER_SUCCESS,
            payload: res.data
        });
        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: res.data
        });

        localStorage.setItem("userInfo", JSON.stringify(res.data));
    })
    .catch(error => {
        if (error.response) {
            dispatch({
                type: USER_REGISTER_FAIL,
                payload: error.response.data
            });
        } else {
            console.log(error);
        }
    });
}

export const logout = () => dispatch => {
    localStorage.removeItem("userInfo");
    dispatch({
        type: USER_LOGOUT
    });
}