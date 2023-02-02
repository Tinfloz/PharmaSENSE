import React, { useEffect, useState } from 'react';
import {
    Box, Button, ButtonGroup, Flex, Spinner, Text,
    useDisclosure, Modal, ModalHeader, ModalBody, ModalOverlay,
    ModalCloseButton, ModalContent, ModalFooter, useToast
} from "@chakra-ui/react";
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useSelector, useDispatch } from 'react-redux';
import { deleteLoginChemistStore, resetChemistHelpers } from '../reducers/chemist/chemist.slice';
import { useNavigate } from 'react-router-dom';

const StoreCard = ({ store }) => {

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: ['places'],
        id: 'google-map-script',
    });
    const navigate = useNavigate();
    const [deleted, setDeleted] = useState(false)

    const { isSuccess, isError } = useSelector(state => state.chemist);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const dispatch = useDispatch();
    const toast = useToast();
    const onClick = async () => {
        await dispatch(deleteLoginChemistStore(store._id));
        onClose();
    };

    useEffect(() => {
        if (!isSuccess && !isError) {
            return
        };
        if (isSuccess && deleted) {
            toast({
                position: "bottom-left",
                title: "Success",
                description: "Successfully deleted!",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } else if (isError && deleted) {
            toast({
                position: "bottom-left",
                title: "Error",
                description: "Could not be deleted!",
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
        };
        dispatch(resetChemistHelpers());
    }, [isSuccess, isError, toast, dispatch])

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
                                    <Button
                                        onClick={() => navigate(`/nearby/deliveries/${store._id}`)}
                                    >
                                        Get Nearby Deliveries
                                    </Button>
                                    <Button
                                        onClick={() => navigate("/store/details", { state: store })}
                                    >
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
                                                <Button variant='ghost'
                                                    onClick={onClick}
                                                >
                                                    Delete
                                                </Button>
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