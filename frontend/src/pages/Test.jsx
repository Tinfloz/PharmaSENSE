import { Flex, Text, Box } from '@chakra-ui/react'
import React from 'react'

const Test = () => {
    return (
        <>
            <Box
                borderWidth="1px"
                borderColor="gray.300"
            >
                <Flex
                    borderWidth="1px"
                    borderColor="red.300"
                >
                    <Text>
                        hello
                    </Text>
                </Flex>
            </Box>
        </>
    )
}

export default Test