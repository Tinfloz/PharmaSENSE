import { Flex } from '@chakra-ui/react'
import React from 'react'
import UserCreds from '../components/UserCreds'

const RegisterChemist = () => {
    return (
        <>
            <Flex
                justify="center"
                alignItems="center"
                p="20vh"
            >
                <UserCreds register={true} chemist={true} />
            </Flex>
        </>
    )
}

export default RegisterChemist