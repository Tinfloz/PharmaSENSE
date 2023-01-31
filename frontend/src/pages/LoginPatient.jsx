import React from 'react'
import UserCreds from '../components/UserCreds';
import { Flex } from "@chakra-ui/react";

const LoginPatient = () => {
    return (
        <>
            <Flex
                justify="center"
                alignItems="center"
                p="20vh"
            >
                <UserCreds register={false} chemist={false} />
            </Flex>
        </>
    )
}

export default LoginPatient