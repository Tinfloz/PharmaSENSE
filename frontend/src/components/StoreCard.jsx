import React, { useEffect, useState } from 'react';
import {
    Box, Button, ButtonGroup, Flex, Spinner, Text,
    useDisclosure, Modal, ModalHeader, ModalBody, ModalOverlay,
    ModalCloseButton, ModalContent, ModalFooter
} from "@chakra-ui/react";
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { getLatLng } from '../helpers/get.lat.lng';

const StoreCard = ({ store }) => {

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
    });

    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <Box
                w={{ base: "60vw", md: "60vw", lg: "50vw" }}
                h={{ base: "20vh", md: "20vh", lg: "45vh" }}
                borderWidth="1px"
                borderColor="gray.300"
                borderRadius="2vh"
                position="relative"
            >
                {
                    !isLoaded ? (
                        <>
                            <Flex
                                justify="center"
                                alignItems="center"
                                p="10vh"
                            >
                                <Spinner />
                            </Flex>
                        </>
                    ) : (
                        <>
                            <Flex
                                p="2vh"
                            >
                                <GoogleMap
                                    center={{ lat: store?.location?.coordinates[1], lng: store?.location?.coordinates[0] }}
                                    zoom={15}
                                    mapContainerStyle={{ width: "100%", height: "35vh" }}
                                    options={{ mapTypeControl: false, zoomControl: false, streetViewControl: false, fullscreenControl: false }}
                                >
                                    <Marker
                                        position={{ lat: store?.location?.coordinates[1], lng: store?.location?.coordinates[0] }}
                                    />
                                </GoogleMap>
                            </Flex>
                            <Flex
                                bottom="0"
                                position="absolute"
                                w="inherit"
                                justify="center"
                                p="1.5vh"
                                alignItems="center"
                            >
                                <ButtonGroup spacing="5vh">
                                    <Button>
                                        Get Nearby Deliveries
                                    </Button>
                                    <Button>
                                        Change Store Details
                                    </Button>
                                    <Button
                                        onClick={onOpen}
                                    >
                                        Delete Store
                                    </Button>
                                    <Modal
                                        isOpen={isOpen}
                                        onClose={onClose}
                                    >
                                        <ModalOverlay />
                                        <ModalContent>
                                            <ModalHeader>Delete Store</ModalHeader>
                                            <ModalCloseButton />
                                            <ModalBody>
                                                Are you sure you want to delete this store?
                                            </ModalBody>
                                            <ModalFooter>
                                                <Button colorScheme='blue' mr={3} onClick={onClose}>
                                                    Close
                                                </Button>
                                                <Button variant='ghost'>Delete</Button>
                                            </ModalFooter>
                                        </ModalContent>
                                    </Modal>
                                </ButtonGroup>
                            </Flex>
                        </>
                    )
                }
            </Box>
        </>
    )
}

export default StoreCard