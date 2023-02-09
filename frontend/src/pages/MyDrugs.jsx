import { Flex, Spinner, Text, VStack } from '@chakra-ui/react'
import React, { useEffect } from 'react';
import DrugCard from '../components/DrugCard';
import { useSelector, useDispatch } from 'react-redux';
import { getAllLoginUserDrugs, resetDrugHelpers } from '../reducers/drugs/drugs.slice';

const MyDrugs = () => {

    const dispatch = useDispatch();
    const { drug } = useSelector(state => state.drug);

    useEffect(() => {
        (async () => {
            await dispatch(getAllLoginUserDrugs());
            dispatch(resetDrugHelpers());
        })()
    }, [dispatch])

    return (
        <>
            <Flex
                justify="center"
                alignItems="center"
                p={!drug ? "15vh" : (drug?.length === 0 ? "10vh" : "5vh")}
            >
                {
                    !drug ? (
                        <>
                            <Spinner
                                thickness='4px'
                                size="xl"
                                speed="0.65s"
                                emptyColor='gray.300'
                                color='blue.500'
                            />
                        </>
                    ) : (
                        <>
                            {
                                drug?.length === 0 ? (
                                    <>
                                        <Text
                                            as="b"
                                            color="gray.400"
                                            fontSize="4vh"
                                        >
                                            There are no medicines to display!
                                        </Text>
                                    </>
                                ) : (
                                    <>
                                        <VStack>
                                            {
                                                drug?.map(element => (
                                                    <DrugCard medicine={element} />
                                                ))
                                            }
                                        </VStack>
                                    </>
                                )
                            }
                        </>
                    )
                }
            </Flex>
        </>
    )
}

export default MyDrugs