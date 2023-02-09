import {
    Box, HStack, Image, Flex, Text, ButtonGroup, Button,
    useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
    ModalBody, ModalFooter, useToast
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import medicinePhoto from "../assets/medicine.png"
import { deleteDrugsLoginUser, resetDrugHelpers } from '../reducers/drugs/drugs.slice';
import { useNavigate } from 'react-router-dom';

const DrugCard = ({ medicine }) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const dispatch = useDispatch();
    const toast = useToast();
    const { isSuccess, isError } = useSelector(state => state.drug);
    const [deleted, setDeleted] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isSuccess && !isError) {
            return
        };
        if (isSuccess && deleted) {
            toast({
                position: "bottom-left",
                title: "Success",
                description: `Deleted from your profile`,
                status: "success",
                duration: 5000,
                isClosable: true,
            })
        };
        if (isError && deleted) {
            toast({
                position: "bottom-left",
                title: "Error",
                description: `Could not be deleted!`,
                status: "warning",
                duration: 5000,
                isClosable: true,
            })
        };
        setDeleted(false);
        dispatch(resetDrugHelpers());
    }, [isSuccess, isError, dispatch, toast, deleted])

    return (
        <>
            <Box
                borderRadius="2vh"
                borderWidth="1px"
                borderColor="gray.300"
                position="relative"
                bg="gray.50"
                w="40vw"
                h="35vh"
            >
                <HStack>
                    <Flex
                        w="35vh"
                    >
                        <Image
                            src={medicinePhoto}
                            objectFit="contain"
                            p="2vh"
                        />
                    </Flex>
                    <Flex>
                        <Text>
                            {medicine?.drug}
                        </Text>
                    </Flex>
                </HStack>
                <Flex
                    position="absolute"
                    bottom="0"
                    p="2.5vh"
                    w="inherit"
                >
                    <ButtonGroup>
                        <Button
                            bg="purple.100"
                            onClick={() => {
                                navigate("/drug/details", { state: medicine })
                            }}
                        >
                            Check Details
                        </Button>
                        <Button
                            bg="purple.100"
                            onClick={onOpen}
                        >
                            Delete Medicine
                        </Button>
                        <Modal
                            isOpen={isOpen}
                            onClose={onClose}
                        >
                            <ModalOverlay />
                            <ModalContent>
                                <ModalHeader>
                                    {`Delete ${medicine?.drug}`}
                                </ModalHeader>
                                <ModalCloseButton />
                                <ModalBody>
                                    Are you sure you want to delete this Drug from your profile?
                                </ModalBody>
                                <ModalFooter>
                                    <ButtonGroup>
                                        <Button
                                            onClick={onClose}
                                        >
                                            Close
                                        </Button>
                                        <Button
                                            onClick={async () => {
                                                onClose();
                                                setDeleted(true);
                                                await dispatch(deleteDrugsLoginUser(medicine?._id));
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </ButtonGroup>
                                </ModalFooter>
                            </ModalContent>
                        </Modal>
                    </ButtonGroup>
                </Flex>
            </Box>
        </>
    )
}

export default DrugCard