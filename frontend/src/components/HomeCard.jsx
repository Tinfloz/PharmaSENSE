import React from 'react';
import { Box, HStack, Text, Image, Flex } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';

const HomeCard = ({ src, text, nav }) => {

    const navigate = useNavigate();

    return (
        <>
            <Box
                w="40vw"
                borderRadius="1.5vh"
                borderWidth="1px"
                borderColor="gray.300"
                onClick={() => navigate(nav)}
            >
                <HStack spacing="3vh">
                    <Flex p="3vh">
                        <Image
                            src={src}
                            w="20vw"
                        />
                    </Flex>
                    <Text as="b" fontSize="3vh">
                        {text}
                    </Text>
                </HStack>
            </Box>
        </>
    )
}

export default HomeCard