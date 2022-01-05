import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import DashboardScreen from "./screens/DashboardScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import PrivateRoomScreen from "./screens/PrivateRoom";

function App() {
    return (
        <Router>
            <main>
                <div>
                    <Routes>
                        <Route exact path="/login" element={<LoginScreen />} />
                        <Route exact path="/signup" element={<RegisterScreen />} />
                        <Route exact path="/dashboard" element={<DashboardScreen />} />
                        <Route path="room/:roomID" element={<PrivateRoomScreen />} />
                        <Route path="/" element={<WelcomeScreen />} />
                    </Routes>
                </div>
            </main>
        </Router>
    );
}

export default App;
