import React from 'react';
import { Flex, HStack, Button, Image, ButtonGroup } from "@chakra-ui/react";
import logo from "../assets/logo.png";

const NavBar = ({ user }) => {
    return (
        <>
            <Flex
                bg="red.300"
                justify="space-between"
            >
                <HStack spacing={user ? "155vh" : "145vh"}>
                    <Image
                        src={logo}
                        alt="logo"
                        borderRadius="1.2vh"
                        width="4rem"
                        height="4rem"
                        ml="0.4rem"
                        mb="0.4rem"
                        mt="0.4rem"
                    />
                    {
                        !user ? (
                            <>
                                <ButtonGroup>
                                    <Button>
                                        Register
                                    </Button>
                                    <Button>
                                        Login
                                    </Button>
                                </ButtonGroup>
                            </>
                        ) : (
                            <>
                                <Button>
                                    Logout
                                </Button>
                            </>
                        )
                    }
                </HStack>
            </Flex>
        </>
    )
}

export default NavBar