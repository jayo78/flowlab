import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import DashboardScreen from './screens/DashboardScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import PreRoomScreen from './screens/PreRoomScreen';
import RoomScreen from './screens/RoomScreen';
import customTheme from './theme';
import { ChakraProvider } from '@chakra-ui/react';

function App() {
    return (
        <ChakraProvider theme={customTheme}>
            <Router>
                <main>
                    <div>
                        <Routes>
                            <Route exact path="/login" element={<LoginScreen />} />
                            <Route exact path="/signup" element={<RegisterScreen />} />
                            <Route exact path="/dashboard" element={<DashboardScreen />} />
                            <Route path="room/join/:roomID" element={<PreRoomScreen />} />
                            <Route path="room/:roomID" element={<RoomScreen />} />
                            <Route path="/" element={<WelcomeScreen />} />
                        </Routes>
                    </div>
                </main>
            </Router>
        </ChakraProvider>
    );
}

export default App;
