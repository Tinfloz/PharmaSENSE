import React, { useRef, useState } from 'react';
import { Box, Button, ButtonGroup, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";


const CreateMedBySpeech = ({ text, type, onClick }) => {

    const { transcript, resetTranscript } = useSpeechRecognition();
    const [isListening, setIsListening] = useState(false);
    const [confirmed, setConfirmed] = useState(false)
    const microphoneRef = useRef(null);

    const handleListening = () => {
        console.log("working")
        setIsListening(true);
        microphoneRef.current.classList.add("listening");
        SpeechRecognition.startListening({
            continuous: true,
        });
    };
    const stopHandle = () => {
        console.log("also working")
        setIsListening(false);
        microphoneRef.current.classList.remove("listening");
        SpeechRecognition.stopListening();
    };
    const handleReset = () => {
        stopHandle();
        resetTranscript();
    };

    return (
        <>
            <Box
                w="30vw"
                h="55vh"
                bg="red.100"
                position="relative"
            >
                <Flex
                    justify="center"
                    alignItems="center"
                    p="3vh"
                >
                    <Heading>
                        {type}
                    </Heading>
                </Flex>
                <Flex
                    justify="center"
                    alignItems="center"
                    p="5vh"
                >
                    <VStack>
                        <Text>
                            {text}
                        </Text>
                        {transcript &&
                            (<Text>
                                <strong>{type}: </strong>{transcript}
                            </Text>)}
                    </VStack>
                </Flex>
                <Flex
                    position="absolute"
                    w="inherit"
                    bottom="0"
                    p="2vh"
                >
                    <ButtonGroup>
                        <Button
                            ref={microphoneRef}
                            onClick={isListening ? stopHandle : handleListening}
                        >
                            {isListening ? "Stop" : "Start Listening"}
                        </Button>
                        {transcript ? (
                            <>
                                <Button
                                    onClick={handleReset}
                                >
                                    Reset
                                </Button>
                                {!confirmed && <Button
                                    onClick={() => {
                                        stopHandle();
                                        onClick(transcript);
                                        setConfirmed(true)
                                    }}
                                >
                                    Confirm
                                </Button>}
                            </>
                        ) : (
                            null
                        )}
                    </ButtonGroup>
                </Flex>
            </Box>
        </>
    )
}

export default CreateMedBySpeech