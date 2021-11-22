import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../actions/userActions";

const RegisterScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(register(email, password, name));
    };

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo, error } = userLogin;

    useEffect(() => {
        if (userInfo) {
            navigate("/dashboard");
        }
    }, [userInfo]);

    return (
        <section>
            <div>
                <div>
                    {error && <p style={{color: 'red'}}>{error.message}</p>}
                    <h2>Sign Up</h2>
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
                                onChange={(e) => {setPassword(e.target.value)}}
                            />
                        </div>

                        <div>
                            <label>Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => {setName(e.target.value)}}
                            />
                        </div>

                        <button>
                            Sign Up
                        </button>

                        <p>
                            Already have an account?
                            <Link to="/login">
                                Login 
                            </Link>
                        </p>
                    </form>
                </div>

            </div>
            <div>

            </div>

        </section> 
    );
}

export default RegisterScreen;
