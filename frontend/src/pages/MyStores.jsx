import { Flex, Spinner, Text } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import StoreCard from '../components/StoreCard';
import { useSelector, useDispatch } from 'react-redux';
import { getAllLoginChemistStores, resetChemist, resetChemistHelpers } from '../reducers/chemist/chemist.slice';

const MyStores = () => {

    const dispatch = useDispatch();
    const { store } = useSelector(state => state.chemist);

    useEffect(() => {
        (async () => {
            await dispatch(getAllLoginChemistStores());
            dispatch(resetChemistHelpers());
        })()
    }, [])


    return (
        <>
            <Flex
                justify="center"
                p="5vh"
            >
                {
                    !store ? (
                        <>
                            <Spinner
                                speed='0.65s'
                                thickness='4px'
                                color='blue.500'
                                emptyColor='gray.300'
                                size='xl'
                            />
                        </>
                    ) : (
                        <>
                            {
                                store.length === 0 ? (
                                    <>
                                        <Text
                                            as="b"
                                            color="gray.300"
                                            fontSize="5vh"
                                        >
                                            There are no stores to display!
                                        </Text>
                                    </>
                                ) : (
                                    <>
                                        {
                                            store?.map(el => (
                                                <StoreCard store={el} />
                                            ))
                                        }
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

export default MyStores