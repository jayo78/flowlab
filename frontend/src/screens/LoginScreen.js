import React, { useState, useEffect } from 'react';
import {
    Flex,
    Box,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Button,
    Text,
    InputGroup,
    InputRightElement,
    Link
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../actions/userActions';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // subscribes to state updates to userLogin
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo, error } = userLogin;

    useEffect(() => {
        if (error) console.log(error);
        if (userInfo) {
            console.log(userInfo);
            navigate('/dashboard');
        }
    }, [userInfo]);

    const handlePasswordVisibility = () => setShowPassword(!showPassword);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(login(email, password));
    };

    return (
        <Flex position="fixed" mt={50} width="full" align="center" justifyContent="center">
            <Box m={8} p={8} maxWidth="500px" borderWidth={1} borderRadius={8} boxShadow="lg">
                <Box textAlign="center">
                    <Heading>Login</Heading>
                </Box>
                <Box my={4} textAlign="left">
                    <form onSubmit={handleSubmit}>
                        {error && <ErrorMessage message={error} />}
                        <FormControl>
                            <FormLabel mb={2}>Email</FormLabel>
                            <Input
                                type="email"
                                placeholder="email"
                                size="lg"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel mt={3} mb={2}>
                                Password
                            </FormLabel>
                            <InputGroup>
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="password"
                                    size="lg"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <InputRightElement p={5} height="3rem" width="3rem">
                                    <Box onClick={handlePasswordVisibility} cursor="pointer">
                                        {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                                    </Box>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        <Button
                            colorScheme="teal"
                            variant="outline"
                            type="submit"
                            width="full"
                            mt={4}>
                            Login
                        </Button>
                    </form>
                    <Text mt={2} align="center" fontSize="xs">
                        Don't have an account?{' '}
                        <Link color="teal" href="signup">
                            Sign Up
                        </Link>
                    </Text>
                </Box>
            </Box>
        </Flex>
    );
};

export default LoginScreen;
