import { Flex } from '@chakra-ui/react'
import React from 'react'
import UserCreds from '../components/UserCreds'

const RegisterPatient = () => {
    return (
        <>
            <Flex
                justify="center"
                alignItems="center"
                p="20vh"
            >
                <UserCreds register={true} chemist={false} />
            </Flex>
        </>
    )
}

export default RegisterPatient