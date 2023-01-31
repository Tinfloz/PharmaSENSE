import { Flex, Spinner } from '@chakra-ui/react'
import React from 'react'

const Fallback = () => {
    return (
        <>
            <Flex
                p="20vh"
                justify="center"
                alignItems="center"
            >
                <Spinner
                    thickness='4px'
                    color='blue.500'
                    emptyColor='gray.300'
                    speed='0.65s'
                    size='xl'
                />
            </Flex>
        </>
    )
}

export default Fallback