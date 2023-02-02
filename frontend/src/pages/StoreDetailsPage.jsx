import React, { useEffect, useState, useRef } from 'react';
import { Flex, Box, VStack, HStack, Heading, Input, Button, Spinner } from "@chakra-ui/react";
import { useJsApiLoader, GoogleMap, Marker } from '@react-google-maps/api';
import Autocomplete from 'react-google-autocomplete';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { changeChemistStoreAddress, changeLoginChemistStoreName, resetChemist, resetChemistHelpers } from '../reducers/chemist/chemist.slice';

const StoreDetails = () => {

    const { state } = useLocation();
    const dispatch = useDispatch();

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: ['places'],
        id: 'google-map-script',
    });

    const [center, setCenter] = useState({
        lat: state.location.coordinates[1],
        lng: state.location.coordinates[0]
    });

    const [address, setAddress] = useState(state.address);

    const [name, setName] = useState({
        name: ""
    });

    const [nameStore, setNameStore] = useState(state.name);

    useEffect(() => {
        return () => {
            dispatch(resetChemist());
        }
    }, [dispatch])

    return (
        <>
            {
                !isLoaded ? (
                    <>
                        <Flex
                            justify="center"
                            alignItems="center"
                            p="10vh"
                        >
                            <Spinner
                                color="blue.500"
                                emptyColor='gray.300'
                                thickness='4px'
                                size="xl"
                                speed='0.65s'
                            />
                        </Flex>
                    </>
                ) : (
                    <>
                        <VStack spacing="50vh">
                            <Box
                                w="100vw"
                                h="80vh"
                                bg="blue.100"
                                position="relative"
                            >
                                <GoogleMap
                                    center={center}
                                    zoom={15}
                                    mapContainerStyle={{ width: "100%", height: "80vh" }}
                                    options={{ mapTypeControl: false, zoomControl: false, streetViewControl: false, fullscreenControl: false }}
                                >
                                    <Marker
                                        position={center}
                                    />
                                </GoogleMap>
                            </Box>
                            <Box
                                w="100vw"
                                h="40vh"
                                bg="red.100"
                                position="absolute"
                                borderTopRadius="20vh"
                                zIndex="1"
                                pt="4vh"
                            >
                                <VStack spacing="2vh">
                                    <Heading size="md">
                                        {address}
                                    </Heading>
                                    <Heading size="md">
                                        Name: {nameStore}
                                    </Heading>
                                    <HStack>
                                        <Input placeholder="change name" w="50vh" bg="white"
                                            onChange={(e) => setName(prevState => ({
                                                ...prevState,
                                                name: e.target.value
                                            }))}
                                        />
                                        <Button
                                            onClick={async () => {
                                                let nameDetails = {
                                                    name,
                                                    id: state._id
                                                }
                                                setNameStore(name.name)
                                                await dispatch(changeLoginChemistStoreName(nameDetails));
                                                dispatch(resetChemistHelpers());
                                            }}
                                        >
                                            Change Name
                                        </Button>
                                    </HStack>
                                    <HStack>
                                        <Autocomplete
                                            apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
                                            style={{ width: '47.5vh', height: "5vh", borderWidth: "1px", borderColor: "gray.300", padding: "2vh", borderRadius: "1vh" }}
                                            onPlaceSelected={place => {
                                                setCenter(prevState => ({
                                                    ...prevState,
                                                    lat: place?.geometry?.location?.lat(),
                                                    lng: place?.geometry?.location?.lng()
                                                }));
                                                setAddress(
                                                    place?.formatted_address
                                                );
                                            }}
                                            options={{
                                                types: ["geocode", "establishment"],
                                            }}
                                        />
                                        <Button
                                            onClick={async () => {
                                                let details = {
                                                    addressDetails: {
                                                        latitude: center.lat,
                                                        longitude: center.lng,
                                                        address
                                                    },
                                                    id: state._id
                                                };
                                                await dispatch(changeChemistStoreAddress(details));
                                                dispatch(resetChemistHelpers());
                                            }}
                                        >
                                            Change Address
                                        </Button>
                                    </HStack>
                                </VStack>
                            </Box>
                        </VStack >
                    </>
                )
            }
        </>
    )
}

export default StoreDetails