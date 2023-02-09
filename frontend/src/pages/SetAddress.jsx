import { Box, Flex, Heading, Spinner, Text, Input, VStack, Button } from "@chakra-ui/react";
import { GoogleMap, Marker, useJsApiLoader, Circle } from '@react-google-maps/api';
import { getLatLng } from '../helpers/get.lat.lng';
import { useEffect, useState, useRef } from 'react';
import { resetAddressHelpers, reverseGeocodeUser } from "../reducers/address/address.slice";
import { useDispatch, useSelector } from "react-redux";
import Autocomplete from "react-google-autocomplete";
import { resetAuthHelpers, setAddressLoginUser } from "../reducers/auth/auth.slice";

const SetAddress = () => {

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: ["places"],
        id: 'google-map-script',
    });

    const firstRenderRef = useRef(true);

    const [center, setCenter] = useState({
        lat: null,
        lng: null
    });

    const [addressUser, setAddressUser] = useState({
        address: null
    });

    const [addressLineOne, setAddressLineOne] = useState("");

    const { address } = useSelector(state => state.address);

    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            const coords = await getLatLng();
            setCenter(prevState => ({
                ...prevState,
                lat: coords.coords.latitude,
                lng: coords.coords.longitude
            }))
            await dispatch(reverseGeocodeUser({ latitude: coords.coords.latitude, longitude: coords.coords.longitude }));
            dispatch(resetAddressHelpers());
        })()
    }, [])

    useEffect(() => {
        if (firstRenderRef.current) {
            firstRenderRef.current = false;
            return;
        };
        (async () => {
            await dispatch(reverseGeocodeUser({ latitude: center.lat, longitude: center.lng }));
            dispatch(resetAddressHelpers());
        })()
    }, [JSON.stringify(addressUser)])

    return (
        <>
            {
                !isLoaded ? (
                    <>
                        <Flex
                            justify="center"
                            alignItems="center"
                            p="15vh"
                        >
                            <Spinner
                                thickness='4px'
                                size='xl'
                                color='blue.500'
                                emptyColor='gray.400'
                                speed='0.65s'
                            />
                        </Flex>
                    </>
                ) : (
                    <>
                        <Box
                            w="100vw"
                            h="90vh"
                            bg="blue.100"
                        >
                            <GoogleMap
                                center={center}
                                zoom={15}
                                mapContainerStyle={{ width: "100%", height: "85vh" }}
                                options={{ mapTypeControl: false, zoomControl: false, streetViewControl: false, fullscreenControl: false }}
                            >
                                <Marker
                                    position={center}
                                />
                            </GoogleMap>
                            <Box
                                position="absolute"
                                bottom="0"
                                h="40vh"
                                bg="red.100"
                                borderTopRadius="20vh"
                                w="inherit"
                                p="2vh"
                            >
                                <Heading size="lg" p="3vh">
                                    {address}
                                </Heading>
                                <VStack>
                                    <Input
                                        placeholder='enter neighnourhood'
                                        w="40vh"
                                        bg="white"
                                        onChange={(e) => setAddressLineOne(e.target.value)}
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
                                            setAddressUser(prevState => ({
                                                ...prevState,
                                                address: place?.formatted_address
                                            }));
                                        }}
                                        options={{
                                            types: ["geocode", "establishment"],
                                        }}
                                    />
                                    <Button
                                        onClick={async () => {
                                            let addressDetails = {
                                                address: `${addressLineOne}, ${addressUser.address}`,
                                                latitude: center.lat,
                                                longitude: center.lng
                                            };
                                            await dispatch(setAddressLoginUser(addressDetails));
                                            dispatch(resetAuthHelpers());
                                        }}
                                    >
                                        Submit
                                    </Button>
                                </VStack>
                            </Box>
                        </Box>
                    </>
                )
            }
        </>
    )
}

export default SetAddress