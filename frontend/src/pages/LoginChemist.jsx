import React from 'react';
import { Flex } from "@chakra-ui/react";
import UserCreds from '../components/UserCreds';

const LoginChemist = () => {
    return (
        <>
            <Flex
                justify="center"
                alignItems="center"
                p="20vh"
            >
                <UserCreds chemist={true} register={false} />
            </Flex>
        </>
    )
}

export default LoginChemist