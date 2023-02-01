import { Box, Flex, VStack, Text, Input, Button, useToast } from '@chakra-ui/react'
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetAuthHelpers, setAddressLoginUser } from '../reducers/auth/auth.slice';
import { getLatLng } from '../helpers/get.lat.lng';

const SetAddress = () => {

    const { isSuccess, isError } = useSelector(state => state.user);

    const [address, setAddress] = useState({
        address: "",
        addressTwo: "",
        city: "",
        state: "",
        pincode: "",
        latitude: null,
        longitude: null
    });

    const dispatch = useDispatch();
    const toast = useToast();

    useEffect(() => {
        (async () => {
            const coords = await getLatLng();
            setAddress(prevState => ({
                ...prevState,
                latitude: coords.coords.latitude,
                longitude: coords.coords.longitude
            }))
        })()
    }, [])

    useEffect(() => {
        if (!isSuccess && !isError) {
            return
        };
        if (isSuccess) {
            toast({
                position: "bottom-left",
                title: "Success",
                description: "Address set successfully",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } else if (isError) {
            toast({
                position: "bottom-left",
                title: "Error",
                description: "Address could not be set",
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
        };
        dispatch(resetAuthHelpers());
        setAddress(prevState => ({
            ...prevState,
            address: "",
            addressTwo: "",
            city: "",
            state: "",
            pincode: "",
            latitude: null,
            longitude: null
        }));
    }, [isSuccess, isError, toast, dispatch])

    const handleChange = (e) => {
        setAddress(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <>
            <Flex
                justify="center"
                alignItems="center"
                p="15vh"
            >
                <Box
                    w="35vw"
                    h="55vh"
                    borderRadius="1vh"
                    borderWidth="1px"
                    borderColor="gray.300"
                >
                    <Flex
                        p="3vh"
                        justify="center"
                        alignItems="center"
                    >
                        <VStack spacing="2vh">
                            <Text as="b" fontSize="3.5vh">
                                Set Address
                            </Text>
                            <Input placeholder='address line 1' name="address" value={address.address}
                                onChange={handleChange} />
                            <Input placeholder='address line 2 (optional)' name="addressTwo" value={address.addressTwo}
                                onChange={handleChange} />
                            <Input placeholder='state' name='state' value={address.state}
                                onChange={handleChange} />
                            <Input placeholder='city' name="city" value={address.city}
                                onChange={handleChange} />
                            <Input placeholder='pincode' name="pincode" value={address.pincode}
                                onChange={handleChange} />
                            <Button
                                onClick={async () => {
                                    await dispatch(setAddressLoginUser(address));
                                }}
                            >
                                Submit
                            </Button>
                        </VStack>
                    </Flex>
                </Box>
            </Flex>
        </>
    )
}

export default SetAddress