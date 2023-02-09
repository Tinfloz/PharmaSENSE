import { Flex, Text, Box, VStack } from '@chakra-ui/react'
import React from 'react'

const Test = () => {
    return (
        <>
            <VStack spacing="-50vh">
                <Box
                    borderWidth="1px"
                    borderColor="gray.300"
                    bg="red.100"
                    h="60vh"
                    w="100vw"
                    display="grid"
                    placeContent="center"
                    zIndex="2"
                >
                    <Text>
                        Hello
                    </Text>
                </Box>
                <Box
                    bg="blue.100"
                    h="100vh"
                    w="100vw"
                    Zindex="1"
                >
                    {/* <Text>
                        hello
                    </Text> */}
                </Box>
            </VStack>
        </>

    )
}

export default Test