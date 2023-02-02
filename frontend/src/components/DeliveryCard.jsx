import React, { useState, useEffect } from 'react';
import { Box, Spinner, Flex, Button } from '@chakra-ui/react';
import { useJsApiLoader, GoogleMap, Circle } from '@react-google-maps/api';
import { getLatLng } from '../helpers/get.lat.lng';

const DeliveryCard = ({ delivery }) => {

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: ['places'],
        id: 'google-map-script'
    });

    const options = {
        strokeColor: '#00ab41',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#39e75f',
        fillOpacity: 0.35,
        clickable: false,
        draggable: false,
        editable: false,
        visible: true,
        radius: 250,
        zIndex: 1
    };

    return (
        <>
            <Box
                w="55vw"
                h="45vh"
                borderWidth="1px"
                borderColor="gray.300"
                borderRadius="5vh"
                position="relative"
                p="2vh"
            >
                {!isLoaded ? (
                    <>
                        <Flex
                            justify="center"
                            alignItems="center"
                            p="2vh"
                        >
                            <Spinner
                                thickness='4px'
                                size='xl'
                                color='blue.500'
                                emptyColor='gray.300'
                                speed='0.65s'
                            />
                        </Flex>
                    </>
                ) : (
                    <>
                        <GoogleMap
                            center={{ lat: delivery.location.coordinates[1], lng: delivery.location.coordinates[0] }}
                            zoom={15}
                            mapContainerStyle={{ width: "100%", height: "35vh", borderRadius: "5vh" }}
                            options={{ mapTypeControl: false, zoomControl: false, streetViewControl: false, fullscreenControl: false }}
                        >
                            <Circle
                                options={options}
                                center={{ lat: delivery?.location?.coordinates[1], lng: delivery?.location?.coordinates[0] }}
                            />
                        </GoogleMap>
                        <Flex
                            w="inherit"
                            position='absolute'
                            bottom="0"
                            p="1.5vh"
                            justify="flex-end"
                            pr="5vh"
                        >
                            <Button
                                w="30vh"
                            >
                                Checkout Delivery
                            </Button>
                        </Flex>
                    </>
                )}
            </Box>
        </>
    )
}

export default DeliveryCard