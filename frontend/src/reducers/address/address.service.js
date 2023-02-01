import axios from "axios";

const API_URL = "http://localhost:5000/api/user/reverse/geocode";

const getAddress = async (latitude, longitude, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    console.log("in service", token)
    const response = await axios.get(API_URL + `?latitude=${latitude}&longitude=${longitude}`, config);
    return response.data;
};

const addressService = {
    getAddress
};

export default addressService;