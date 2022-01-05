import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../actions/userActions";

const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // subscribes to state updates to userLogin
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo, error } = userLogin;

    useEffect(() => {
        if (error)
            console.log(error)
        if (userInfo) {
            console.log(userInfo);
            navigate("/dashboard");
        }
    }, [userInfo]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(login(email, password));
    };

    return (
        <section>
            <div>
                <div>
                    {error && <p style={{color: 'red'}}>{error.message}</p>}
                    <h2>Login</h2>
                    <form onSubmit={submitHandler}>
                        <div>
                            <label>Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button>
                            Login
                        </button>

                        <p>
                            Don't have an account ?{" "}
                            <Link to="/signup">
                                Sign Up
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
            <div>
                <div>
                </div>
            </div>
        </section>
    );
};

export default LoginScreen;
