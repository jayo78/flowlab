import React, { useState, useEffect } from "react";
import {
    chakra,
    Flex,
    Box,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Button,
    CircularProgress,
    Text,
    InputGroup,
    InputRightElement,
    Link,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../actions/userActions";

const RegisterScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handlePasswordVisibility = () => setShowPassword(!showPassword);

    const handleSubmit = (e) => {
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
        <Flex position="fixed" mt={50} width="full" align="center" justifyContent="center">
            <Box m={8} p={8} maxWidth="500px" borderWidth={1} borderRadius={8} boxShadow="lg">
                <Box textAlign="center">
                    <Heading>Sign Up</Heading>
                </Box>
                <Box my={4} textAlign="left">
                    <chakra.form onSubmit={handleSubmit}>
                        {error && <ErrorMessage message={error} />}
                        <FormControl>
                            <FormLabel mb={2}>Email</FormLabel>
                            <Input
                                type="email" 
                                placeholder="email"
                                size="lg"
                                onChange={((e) => setEmail(e.target.value))}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel mt={3} mb={2}>Name</FormLabel>
                            <Input
                                type="text" 
                                placeholder="name"
                                size="lg"
                                onChange={((e) => setName(e.target.value))}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel mt={3} mb={2}>Password</FormLabel>
                            <InputGroup>
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="password"
                                    size="lg"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <InputRightElement p={5} height="3rem" width="3rem">
                                    <Box onClick={handlePasswordVisibility} cursor="pointer">
                                        {showPassword ? (
                                        <ViewIcon/>
                                        ) : (
                                        <ViewOffIcon/>
                                        )}
                                    </Box>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        <Button colorScheme="teal" variant="outline" type="submit" width="full" mt={4}>
                            Sign Up
                        </Button>
                    </chakra.form>
                    <Text mt={2} align="center" fontSize="xs">
                        Already have an account? <Link color="teal" href="login">Login</Link>
                    </Text>
                </Box>
            </Box>
        </Flex>
    );
}

export default RegisterScreen;
