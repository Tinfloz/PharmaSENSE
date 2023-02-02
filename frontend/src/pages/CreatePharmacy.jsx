import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { Flex, Box, VStack, Spinner, Input, Button, Heading, useToast } from "@chakra-ui/react";
import { getLatLng } from '../helpers/get.lat.lng';
import Autocomplete from 'react-google-autocomplete';
import { useSelector, useDispatch } from 'react-redux';
import { reverseGeocodeUser } from '../reducers/address/address.slice';
import { createStoreLoginChemist, resetChemistHelpers } from '../reducers/chemist/chemist.slice';

const CreatePharmacy = () => {

    const firstRenderRef = useRef(false)
    const { address } = useSelector(state => state.address);
    const { isSuccess, isError } = useSelector(state => state.chemist)
    const dispatch = useDispatch();
    const toast = useToast();
    const [center, setCenter] = useState({
        lat: null,
        lng: null,
    });
    const [storeAddress, setStoreAddress] = useState({
        address: ""
    })
    const [name, setName] = useState("");

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: ['places'],
        id: 'google-map-script',
    });

    useEffect(() => {
        (async () => {
            const coords = await getLatLng();
            setCenter(prevState => ({
                ...prevState,
                lat: coords.coords.latitude,
                lng: coords.coords.longitude,
            }));
        })()
    }, [])

    useEffect(() => {
        (async () => {
            const coords = await getLatLng();
            await dispatch(reverseGeocodeUser({ latitude: coords.coords.latitude, longitude: coords.coords.longitude }))
        })()
    }, [])

    useEffect(() => {
        if (!firstRenderRef.current) {
            firstRenderRef.current = true;
            return
        };
        (async () => {
            await dispatch(reverseGeocodeUser({ latitude: center.lat, longitude: center.lng }))
        })()
    }, [storeAddress])

    useEffect(() => {
        if (!isSuccess && !isError) {
            return
        };
        if (isSuccess) {
            toast({
                position: "bottom-left",
                title: "Success",
                description: "Store created successfully!",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } else if (isError) {
            toast({
                position: "bottom-left",
                title: "Error",
                description: "Store could not be created!",
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
        };
        dispatch(resetChemistHelpers());
        setName("");
    }, [isSuccess, isError, dispatch, toast])

    return (
        <>
            {!isLoaded ? (
                <>
                    <Flex
                        justify="center"
                        alignItems="center"
                        p="15vh"
                    >
                        <Spinner
                            thickness='4px'
                            speed='0.65s'
                            color='blue.500'
                            emptyColor='gray.300'
                            size='xl'
                        />
                    </Flex>
                </>
            ) : (
                <>
                    <VStack spacing="45vh">
                        <Box
                            w="100vw"
                            h="90vh"
                            position="absolute"
                        >
                            <GoogleMap
                                center={center}
                                zoom={15}
                                mapContainerStyle={{ width: "100%", height: "65vh" }}
                                options={{ mapTypeControl: false, zoomControl: false, streetViewControl: false, fullscreenControl: false }}
                            >
                                <Marker
                                    position={center}
                                />
                            </GoogleMap>
                        </Box>
                        <Box
                            w="100vw"
                            h="45vh"
                            borderTopRadius="20vh"
                            bg="red.100"
                            position="relative"
                            zIndex="1"
                            display="flex"
                            justifyContent="center"
                            pt="5vh"
                        >
                            <VStack spacing="3vh">
                                <Heading size="lg">
                                    {address}
                                </Heading>
                                <Input placeholder='name' w="40vh" bg="white"
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <Autocomplete
                                    apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
                                    style={{ width: '40vh', height: "5vh", borderWidth: "1px", borderColor: "gray.300", padding: "2vh", borderRadius: "1vh" }}
                                    onPlaceSelected={place => {
                                        setCenter(prevState => ({
                                            ...prevState,
                                            lat: place?.geometry?.location?.lat(),
                                            lng: place?.geometry?.location?.lng()
                                        }));
                                        setStoreAddress(prevState => ({
                                            ...prevState,
                                            address: place?.formatted_address
                                        }));
                                    }}
                                    options={{
                                        types: ["geocode", "establishment"],
                                    }}
                                />
                                <Button
                                    bg="blue.400"
                                    color="white"
                                    onClick={async () => {
                                        let storeDetails = {
                                            name,
                                            address: storeAddress.address,
                                            latitude: center.lat,
                                            longitude: center.lng
                                        };
                                        await dispatch(createStoreLoginChemist(storeDetails));
                                    }}
                                >
                                    Submit
                                </Button>
                            </VStack>
                        </Box>
                    </VStack>
                </>
            )}
        </>
    )
}

export default CreatePharmacy