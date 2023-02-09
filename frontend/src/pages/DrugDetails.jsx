import React from 'react';
import { Box, Flex, Heading, HStack, IconButton, Stack, Text } from "@chakra-ui/react";
import { useLocation, useNavigate } from 'react-router-dom';
import { BiArrowBack } from "react-icons/bi";

const DrugDetails = () => {

    const { state } = useLocation();
    const navigate = useNavigate();

    return (
        <>
            <Flex
                justify="flex-start"
                p="3vh"
            >
                <IconButton
                    icon={<BiArrowBack />}
                    onClick={() => navigate(-1)}
                />
            </Flex>
            <Flex
                justify="center"
                alignItems="center"
                p="10vh"
            >

                <Box
                    w="45vw"
                    h="50vh"
                    borderRadius="2vh"
                    borderWidth="1px"
                    borderColor="gray.300"
                    p="5vh"
                >
                    <Flex
                        justify="center"
                        alignItems="center"
                    >
                        <Heading>
                            {state?.drug}
                        </Heading>
                    </Flex>
                    <Stack>
                        {
                            Object.entries(state).map(el => (
                                el[0] === "patient" || el[0] === "_id" || el[0] === "createdAt" || el[0] === "updatedAt" || el[0] === "__v" ? (null) : (
                                    <>
                                        <HStack>
                                            <Heading size="md">
                                                {
                                                    el[0] === "uptoCriticalLevelDays" ? ("days remaining:") : `${el[0]}:`
                                                }
                                            </Heading>
                                            <Text>
                                                {el[1]}
                                            </Text>
                                        </HStack>
                                    </>
                                )
                            ))
                        }
                    </Stack>
                </Box>
            </Flex>
        </>
    )
}

export default DrugDetails