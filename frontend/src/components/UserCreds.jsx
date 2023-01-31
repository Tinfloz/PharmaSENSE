import React, { useState, useEffect } from 'react';
import { Box, Flex, Input, Text, VStack, Button, useToast } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser, resetAuthHelpers } from '../reducers/auth/auth.slice';

const UserCreds = ({ register, chemist }) => {
    console.log("rerendered")
    const [creds, setCreds] = useState({
        email: "",
        password: "",
        name: "",
        userType: chemist ? "Chemist" : "Patient"
    });

    const { isSuccess, isError } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const toast = useToast();

    const handleChange = (e) => {
        setCreds(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    useEffect(() => {
        if (!isSuccess && !isError) {
            return
        };
        if (isSuccess) {
            toast({
                position: "bottom-left",
                title: "Success",
                description: register ? "Successfully registered!" : "Logged in successfully!",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } else if (isError) {
            toast({
                position: "bottom-left",
                title: "Error",
                description: register ? "Could not register successfully!" : "Could not log you in!",
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
        };
        dispatch(resetAuthHelpers());
        setCreds(prevState => ({
            ...prevState,
            email: "",
            password: "",
            name: "",
            userType: "",
        }));
    }, [isSuccess, isError, dispatch, toast])

    const handleSubmit = async (e) => {
        register ?
            await dispatch(registerUser(creds)) :
            await dispatch(loginUser(creds))
    };

    return (
        <>
            <Box
                w="30vw"
                h="50vh"
                borderRadius="1vh"
                borderWidth="1px"
                borderColor="gray.300"
            >
                <Flex
                    justify="center"
                    alignItems="center"
                    p="3vh"
                >
                    <VStack spacing="4vh">
                        <Text
                            fontSize={{ base: '15px', md: '20px', lg: '30px' }}
                            as="b"
                        >
                            {
                                register ? (chemist ? "Register as a chemist" : "Register as a patient") :
                                    (chemist ? "Login to your chemist account" : "Login to your patient account")
                            }
                        </Text>
                        {register ? <Input placeholder='name' value={creds.name} name="name" onChange={handleChange} /> : null}
                        <Input placeholder="email" value={creds.email} name="email" onChange={handleChange} />
                        <Input placeholder="password" value={creds.password} name="password" onChange={handleChange} />
                        <Button
                            onClick={handleSubmit}
                        >
                            {
                                register ? "Register" : "Login"
                            }
                        </Button>
                    </VStack>
                </Flex>
            </Box>
        </>
    )
}

export default UserCreds