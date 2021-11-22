import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const WelcomeScreen = () => {
    
    return (
        <section>
            <h1>Welcome!</h1>
            <Link to="login">
                Login
            </Link>
        </section>

    );
}

export default WelcomeScreen;