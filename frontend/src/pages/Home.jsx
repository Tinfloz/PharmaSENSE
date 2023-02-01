import { Flex, VStack } from '@chakra-ui/react'
import React from 'react'
import HomeCard from '../components/HomeCard'
import { useSelector } from 'react-redux'
import medicine from "../assets/medicine.png";
import details from "../assets/details.png";
import createMedicine from "../assets/createMedicine.png";
import pharmacies from "../assets/pharmacies.png";

const Home = () => {

    const userType = useSelector(state => state.user.user.userType);

    return (
        <>
            <Flex
                p="10vh"
                justify="center"
                alignItems="center"
            >
                {
                    userType === "Chemist" ? (
                        <>
                            <VStack>
                                <HomeCard src={medicine} text={"My medicines"} nav={"#"} />
                                <HomeCard src={details} text={"My details"} nav={"#"} />
                                <HomeCard src={createMedicine} text={"Enter new medication"} nav={"#"} />
                            </VStack>
                        </>
                    ) : (
                        <>
                            <VStack>
                                <HomeCard src={pharmacies} text={"My stores"} nav={"#"} />
                                <HomeCard src={details} text={"My details"} nav={"#"} />
                                <HomeCard src={createMedicine} text={"Create new store"} nav={"/create/pharmacy"} />
                            </VStack>
                        </>
                    )
                }
            </Flex>
        </>
    )
}

export default Home