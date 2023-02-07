import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Box, Button, ButtonGroup, Flex, VStack, Text, Heading, Image, useToast } from "@chakra-ui/react";
import camera from '../helpers/click.photo';
import Webcam from "react-webcam";

const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
};

const CreateMedByPhoto = ({ text, onClick }) => {

    const webcamRef = useRef(null);
    const firstRenderRef = useRef(false)
    const [imgSrc, setImgSrc] = useState(null);
    const [camera, setCamera] = useState(false);
    const [confirmed, setConfirmed] = useState(false);
    const [photo, setPhoto] = useState(false);
    const toast = useToast();

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImgSrc(imageSrc);
    }, [webcamRef, setImgSrc]);

    useEffect(() => {
        if (!firstRenderRef.current) {
            firstRenderRef.current = true
            return
        };
        toast({
            position: "bottom-left",
            title: "Success",
            description: "Confirmed!",
            status: "success",
            duration: 5000,
            isClosable: true,
        })
    }, [photo])

    return (
        <>
            {!camera ? (
                <>
                    <Box
                        w="45vw"
                        h="50vh"
                        bg="red.100"
                        position="relative"
                    >
                        {
                            !confirmed ? (
                                <>
                                    <Flex
                                        justify="center"
                                        alignItems="center"
                                        p="3vh"
                                    >
                                        <Heading>
                                            Scan your bottle
                                        </Heading>
                                    </Flex>
                                    <Flex
                                        justify="center"
                                        alignItems="center"
                                        p="5vh"
                                    >
                                        <Text>
                                            {text}
                                        </Text>
                                    </Flex>
                                    <Flex
                                        position="absolute"
                                        bottom="0"
                                        p="3vh"
                                    >
                                        <Button
                                            onClick={() => setCamera(true)}
                                        >
                                            Open Camera
                                        </Button>
                                    </Flex>
                                </>
                            ) : (
                                <>
                                    <Flex
                                        justify="center"
                                        alignItems="center"
                                        p="2vh"
                                    >
                                        <Heading>
                                            Confirm
                                        </Heading>
                                    </Flex>
                                    <Flex
                                        justify="center"
                                        alignItems="center"
                                        p="5vh"
                                    >
                                        <Image
                                            src={imgSrc}
                                            alt="image"
                                        />
                                    </Flex>
                                    <Flex
                                        position="absolute"
                                        p="3vh"
                                        bottom="0"
                                    >
                                        <ButtonGroup>
                                            <Button
                                                onClick={() => {
                                                    onClick(imgSrc);
                                                    setPhoto(true);
                                                }}
                                            >
                                                Confirm
                                            </Button>
                                            <Button
                                                onClick={() => setCamera(true)}
                                            >
                                                Take Again
                                            </Button>
                                        </ButtonGroup>
                                    </Flex>
                                </>
                            )
                        }
                    </Box>
                </>
            ) : (
                <>
                    <Flex
                        justify="center"
                        alignItems="center"
                    >
                        <VStack spacing="3vh">
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                videoConstraints={videoConstraints}
                                minScreenshotWidth={180}
                                minScreenshotHeight={180}
                            />
                            <Button onClick={() => {
                                capture();
                                setCamera(false);
                                setConfirmed(true);
                            }}>Capture Photo</Button>
                        </VStack>
                    </Flex>
                </>
            )}
        </>
    )
}



export default CreateMedByPhoto