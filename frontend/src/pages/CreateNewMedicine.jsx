import React, { useState, useMemo } from 'react';
import {
    Tabs, TabList, TabPanels, Tab, TabPanel, Input, Box,
    Flex, Text, VStack, Button, Grid, GridItem, Heading, useToast
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import moment from "moment";
import { createMedLoginUser, resetPatientHelpers } from '../reducers/patient/patient.slice';
import { useEffect } from 'react';

const getSlots = () => {
    const start = moment("00:00", "HH:mm");
    const timeSlots = [];
    while (start) {
        const slot = `${start.format("HH:mm")}-${start.add(1, "hour").format("HH:mm")}`;
        timeSlots.push(slot);
        if (start.format("HH:mm") === "00:00") {
            break;
        };
    };
    return timeSlots;
};

const CreateNewMedicine = () => {
    return (
        <>
            <Tabs variant='soft-rounded' colorScheme='green' p="1vh" isLazy>
                <TabList>
                    <Tab>Voice</Tab>
                    <Tab>Manual</Tab>
                    <Tab>Scan</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <p>one!</p>
                    </TabPanel>
                    <TabPanel>
                        <CreateManually />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </>
    )
}

const CreateManually = () => {

    const slots = useMemo(getSlots, [])
    const [med, setMed] = useState({
        name: "",
        dosage: "",
        volume: "",
    });

    const [timing, setTiming] = useState([]);
    const dispatch = useDispatch();
    const toast = useToast();
    const { isSuccess, isError } = useSelector(state => state.patient);

    useEffect(() => {
        if (!isSuccess && !isError) {
            return
        } else if (isSuccess) {
            toast({
                position: "bottom-left",
                title: "Success",
                description: "Medicine added to your profile!",
                status: "success",
                duration: 5000,
                isClosable: true,
            })
        } else if (isError) {
            toast({
                position: "bottom-left",
                title: "Error",
                description: "Medicine could not be added!",
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
        };
        dispatch(resetPatientHelpers());
    }, [isSuccess, isError, dispatch, toast])

    const handleChange = (e) => {
        setMed(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <>
            <Flex
                justify="center"
                alignItems="center"
                p="2vh"
            >
                <VStack>
                    <Box
                        w="40vw"
                        h="35vh"
                        borderWidth="1px"
                        borderColor="gray.300"
                        borderRadius="2vh"
                    >
                        <Flex
                            justify="center"
                            alignItems="center"
                            p="2vh"
                        >
                            <VStack spacing="3vh">
                                <Text
                                    as="b"
                                    fontSize="3vh"
                                >
                                    Add new medicine
                                </Text>
                                <Input placeholder='name' name="name" value={med.name} onChange={handleChange} />
                                <Input placeholder='dosage' name="dosage" value={med.dosage} onChange={handleChange} />
                                <Input placeholder='volume' name="volume" value={med.volume} onChange={handleChange} />
                            </VStack>
                        </Flex>
                    </Box>
                    <Box
                        w="90vw"
                        h="35vh"
                        p="2vh"
                    >
                        <Flex
                            justify="center"
                            p="2.5vh"
                        >
                            <Heading>
                                Select slots
                            </Heading>
                        </Flex>
                        <Grid
                            templateColumns='repeat(8, 1fr)' gap={6}
                        >
                            {
                                slots.map(el => (
                                    <GridItem>
                                        <Button
                                            isDisabled={timing.includes(el) ? true : false}
                                            onClick={() => {
                                                console.log(timing.includes(el))
                                                setTiming(prevState => [...prevState, el])
                                            }}
                                        >
                                            {el}
                                        </Button>
                                    </GridItem>
                                ))
                            }
                        </Grid>
                    </Box>
                    <Button
                        bg="purple.200"
                        onClick={async () => {
                            let details = Object.assign(med, { slots: timing })
                            await dispatch(createMedLoginUser(details));
                            dispatch(resetPatientHelpers());
                        }}
                    >
                        Submit
                    </Button>
                </VStack>
            </Flex>
        </>
    )
}

export default CreateNewMedicine