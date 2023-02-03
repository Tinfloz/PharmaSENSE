import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import {
    Tabs, TabList, TabPanels, Tab, TabPanel, Input, Box,
    Flex, Text, VStack, Button, Grid, GridItem, Heading, useToast, HStack, Code, ButtonGroup, Stack
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import moment from "moment";
import { createMedLoginUser, resetPatientHelpers } from '../reducers/patient/patient.slice';
import SpeechRecognition from 'react-speech-recognition';
import CreateMedBySpeech from '../components/CreateMedBySpeech';
import dosage from "../assets/dosage";
import name from "../assets/name";
import volume from "../assets/volume";
import GetSlotsBySpeech from '../components/GetSlotsBySpeech';

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
                        <CreateBySpeech />
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

const CreateBySpeech = () => {

    const dispatch = useDispatch();
    const { isSuccess, isError } = useSelector(state => state.patient);
    const toast = useToast();

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
    }, [isSuccess, isError, toast, dispatch])

    const [med, setMed] = useState({
        volume: null,
        dosage: null,
        name: null,
        slots: null
    });

    const onDosageClick = useCallback((dosage) => {
        setMed(prevState => ({
            ...prevState,
            dosage: dosage
        }));
    }, []);

    const onNameClick = useCallback((name) => {
        setMed(prevState => ({
            ...prevState,
            name: name
        }));
    }, []);

    const onVolumeClick = useCallback((volume) => {
        setMed(prevState => ({
            ...prevState,
            volume: volume
        }));
    }, []);

    const onSlotsClick = useCallback((slotsArray) => {
        setMed(prevState => ({
            ...prevState,
            slots: slotsArray
        }))
    }, [])

    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
        return (
            <Flex
                justify="center"
                alignItems="center"
                p="10vh"
            >
                <Text
                    as="b"
                    color="gray.400"
                    fontSize="5vh"
                >
                    Browser does not Support Speech Recognition.
                </Text>
            </Flex>
        );
    };
    return (
        <>
            <Tabs variant='soft-rounded' colorScheme='purple' p="1vh" isLazy>
                <TabList>
                    <Tab>Set Name</Tab>
                    <Tab>Set Dosage</Tab>
                    <Tab>Set Volume</Tab>
                    <Tab>Set Slot</Tab>
                    {
                        med.dosage && med.volume && med.name && med.slots !== null ? (
                            <Tab>
                                Confirm
                            </Tab>
                        ) : (
                            null
                        )
                    }
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Flex
                            borderWidth="1px"
                            borderColor="red.100"
                            h="65vh"
                            justify="center"
                            alignItems="center"
                        >
                            <CreateMedBySpeech
                                text={name}
                                type={"Name"}
                                onClick={onNameClick}
                            />
                        </Flex>
                    </TabPanel>
                    <TabPanel>
                        <Flex
                            borderWidth="1px"
                            borderColor="red.100"
                            h="65vh"
                            justify="center"
                            alignItems="center"
                        >
                            <CreateMedBySpeech
                                text={dosage}
                                type={"Dosage"}
                                onClick={onDosageClick}
                            />
                        </Flex>
                    </TabPanel>
                    <TabPanel>
                        <Flex
                            borderWidth="1px"
                            borderColor="red.100"
                            h="65vh"
                            justify="center"
                            alignItems="center"
                        >
                            <CreateMedBySpeech
                                text={volume}
                                type={"Volume"}
                                onClick={onVolumeClick}
                            />
                        </Flex>
                    </TabPanel>
                    <TabPanel>
                        <Flex
                            borderWidth="1px"
                            borderColor="red.100"
                            h="65vh"
                            justify="center"
                            alignItems="center"
                        >
                            <GetSlotsBySpeech onClick={onSlotsClick} />
                        </Flex>
                    </TabPanel>
                    <TabPanel>
                        <Flex
                            borderWidth="1px"
                            borderColor="red.100"
                            h="65vh"
                            justify="center"
                            alignItems="center"
                        >
                            <Box
                                w="40vw"
                                h="50vh"
                                bg="red.100"
                            >
                                <Flex
                                    justify="center"
                                    alignItems="center"
                                    p="3vh"
                                >
                                    <Stack spacing="2vh">
                                        <Text
                                            as="b"
                                            fontSize="3.5vh"
                                        >
                                            Check Details
                                        </Text>
                                        {
                                            Object.entries(med).map(el => (
                                                <HStack>
                                                    <Text
                                                        as="b"
                                                    >
                                                        {el[0]}:
                                                    </Text>
                                                    <Text>
                                                        {(() => {
                                                            let text;
                                                            if (el[0] === "slots") {
                                                                text = el[1]?.join(", ");
                                                                return text;
                                                            } else {
                                                                return el[1]
                                                            }
                                                        })()}
                                                    </Text>
                                                </HStack>
                                            ))
                                        }
                                        <Button
                                            onClick={async () => {
                                                await dispatch(createMedLoginUser(med));
                                                dispatch(resetPatientHelpers());
                                            }}
                                        >
                                            Submit
                                        </Button>
                                    </Stack>
                                </Flex>
                            </Box>
                        </Flex>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </>
    )
}

export default CreateNewMedicine