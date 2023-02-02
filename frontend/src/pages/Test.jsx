import React from 'react';
import { Flex } from "@chakra-ui/react";
import DeliveryCard from '../components/DeliveryCard';

const Test = () => {
    return (
        <>
            <Flex
                justify="center"
                alignItems="center"
                p="10vh"
            >
                <DeliveryCard />
            </Flex>
        </>
    )
}

export default Test