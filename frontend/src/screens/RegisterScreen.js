import React, { useState, useEffect } from 'react';
import {
    chakra,
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
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../actions/userActions';
import ErrorMessage from '../components/ErrorMessage';

const RegisterScreen = () => {
    // local state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // hook
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // redux - global state store subscriptions
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;
    const userRegister = useSelector((state) => state.userRegister);
    const { error } = userRegister;

    //
    // executes on updates to userInfo
    useEffect(() => {
        console.log('[RegisterScreen] mount');
        if (error) console.log('\terror ' + error);
        if (userInfo) {
            console.log('\tredirecting to dashboard');
            navigate('/dashboard');
        }
    }, [userInfo]);

    const handlePasswordVisibility = () => setShowPassword(!showPassword);

    const handleSubmit = (e) => {
        console.log('[RegisterScreen] handleSubmit');
        e.preventDefault();
        dispatch(register(email, password, name));
    };

    return (
        <Flex position="fixed" mt={50} width="full" align="center" justifyContent="center">
            <Box m={8} p={8} maxWidth="500px" borderWidth={1} borderRadius={8} boxShadow="lg">
                <Box textAlign="center">
                    <Heading>Sign Up</Heading>
                </Box>
                <Box my={4} textAlign="left">
                    <chakra.form onSubmit={handleSubmit}>
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
                                Name
                            </FormLabel>
                            <Input
                                type="text"
                                placeholder="name"
                                size="lg"
                                onChange={(e) => setName(e.target.value)}
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
                            border="1px"
                            borderColor="primary"
                            variant="outline"
                            type="submit"
                            width="full"
                            mt={4}>
                            Sign Up
                        </Button>
                    </chakra.form>
                    <Text mt={2} align="center" fontSize="xs">
                        Already have an account?{' '}
                        <Link color="primary" href="login">
                            Login
                        </Link>
                    </Text>
                </Box>
            </Box>
        </Flex>
    );
};

export default RegisterScreen;
