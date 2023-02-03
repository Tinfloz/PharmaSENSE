import React, { useMemo, useState, useRef } from 'react';
import moment from 'moment';
import { Button, ButtonGroup, Code, Flex, Grid, GridItem, VStack, Text, Box, Tooltip } from '@chakra-ui/react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const getSlots = () => {
    const startTime = moment("00:00", "HH:mm");
    let slotsArray = [];
    while (startTime) {
        let slot = `${startTime.format("HH:mm")}-${startTime.add(1, "hour").format("HH:mm")}`;
        slotsArray.push(slot);
        if (startTime.format("HH:mm") === "00:00") {
            break;
        };
    };
    return slotsArray;
};

const GetSlotsBySpeech = ({ onClick }) => {

    const slots = useMemo(getSlots, []);
    const [chosenSlots, setChosenSlots] = useState([]);
    const [isListening, setIsListening] = useState(false);
    const microphoneRef = useRef(null);
    const [confirmed, setConfirmed] = useState(false)

    const commands = useMemo(() => {
        const commands = [];
        for (let i of slots) {
            let command = {
                command: `set ${slots.indexOf(i) + 1}`,
                callback: () => {
                    setChosenSlots(prevState => [...prevState, i])
                }
            };
            commands.push(command)
        };
        return commands;
    }, []);

    const { transcript, resetTranscript } = useSpeechRecognition({ commands });
    console.log(transcript);

    const handleListening = () => {
        setIsListening(true);
        microphoneRef.current.classList.add("listening");
        SpeechRecognition.startListening({
            continuous: true,
        });
    };
    const stopHandle = () => {
        setIsListening(false);
        microphoneRef.current.classList.remove("listening");
        SpeechRecognition.stopListening();
    };
    const handleReset = () => {
        stopHandle();
        setConfirmed(false);
        resetTranscript();
    };

    return (
        <>
            <Box
                position="relative"
                h="inherit"
                w="80vw"
            >
                <Flex
                    justify="center"
                    alignItems="center"
                    p="5vh"
                >
                    {
                        chosenSlots.length === 0 ? (
                            <Grid templateColumns='repeat(8, 1fr)' gap={6}>
                                {
                                    slots.map((el, idx) => (
                                        <>
                                            <GridItem>
                                                <Tooltip
                                                    label={`set ${idx + 1}`}
                                                >
                                                    <Code
                                                        colorScheme="orange"
                                                        borderRadius="2vh"
                                                        fontSize="2vh"
                                                    >
                                                        {el}
                                                    </Code>
                                                </Tooltip>
                                            </GridItem>
                                        </>
                                    ))
                                }
                            </Grid>
                        ) : (
                            <>
                                {
                                    <Grid templateColumns='repeat(8, 1fr)' gap={6}>
                                        {
                                            chosenSlots.map(el => (
                                                <GridItem>
                                                    <Code
                                                        colorScheme="orange"
                                                        borderRadius="2vh"
                                                        fontSize="2vh"
                                                    >
                                                        {el}
                                                    </Code>
                                                </GridItem>
                                            ))
                                        }
                                    </Grid>
                                }
                            </>
                        )
                    }
                </Flex>
                <Box
                    position="absolute"
                    bottom="0"
                    w="inherit"
                    p="3vh"
                >
                    <ButtonGroup>
                        <Button
                            ref={microphoneRef}
                            onClick={isListening ? stopHandle : handleListening}
                        >
                            {isListening ? "Stop" : "Start Listening"}
                        </Button>
                        {transcript && (
                            <>
                                <Button
                                    onClick={handleReset}
                                >
                                    Set Another Slot
                                </Button>
                                {!confirmed && <Button
                                    onClick={() => {
                                        onClick(chosenSlots);
                                        setConfirmed(true);
                                    }}
                                >
                                    Confirm
                                </Button>}
                            </>
                        )}
                    </ButtonGroup>
                </Box>
            </Box>
        </>
    )
}

export default GetSlotsBySpeech