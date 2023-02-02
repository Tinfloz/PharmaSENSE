import React, { useEffect } from 'react';
import { Flex, Spinner, VStack, Text } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMyStoreDeliveries, resetDeliveryHelpers } from '../reducers/deliveries/deliveries.slice';
import DeliveryCard from '../components/DeliveryCard';

const NearbyDeliveries = () => {

    const { id } = useParams();
    const dispatch = useDispatch();
    const { deliveries } = useSelector(state => state.delivery);

    useEffect(() => {
        (async () => {
            await dispatch(getMyStoreDeliveries(id));
            dispatch(resetDeliveryHelpers());
        })()
    }, [])

    return (
        <>
            <Flex
                justify="center"
                alignItems="center"
                p={!deliveries ? "15vh" : "7vh"}
            >
                {
                    !deliveries ? (
                        <>
                            <Spinner
                                speed='0.65s'
                                color='blue.500'
                                emptyColor='gray.300'
                                size='xl'
                                thickness='4px'
                            />
                        </>
                    ) : (
                        <>
                            {
                                deliveries?.length === 0 ? (
                                    <>
                                        <Text
                                            as="b"
                                            color="gray.300"
                                            fontSize="5vh"
                                        >
                                            There are no deliveries nearby!
                                        </Text>
                                    </>
                                ) : (
                                    <>
                                        {
                                            deliveries?.map(element => (
                                                <DeliveryCard delivery={element} />
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

export default NearbyDeliveries