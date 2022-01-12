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
import ErrorMessage from '../components/ErrorMessage';

const LoginScreen = () => {
    // local state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // hooks
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // redux - global state store subscription to userLogin
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo, error } = userLogin;

    //
    // executes on updates to userInfo
    useEffect(() => {
        console.log('[LoginScreen] mount');
        if (error) console.error('\terror ' + error);
        if (userInfo) {
            console.log('\tredirecting to dashboard');
            navigate('/dashboard');
        }
    }, [userInfo]);

    const handlePasswordVisibility = () => setShowPassword(!showPassword);

    const handleSubmit = (e) => {
        console.log('[LoginScreen] handleSubmit');
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
                        <FormControl isRequired>
                            <FormLabel mb={2}>Email</FormLabel>
                            <Input
                                type="email"
                                placeholder="email"
                                size="lg"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </FormControl>
                        <FormControl isRequired>
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
