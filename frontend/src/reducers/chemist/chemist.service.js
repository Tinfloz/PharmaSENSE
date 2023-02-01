import axios from "axios";

const API_URL = "http://localhost:5000/api/chemist";

const createStoreChemist = async (storeDetails, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.post(API_URL + `/create/store`, storeDetails, config);
    return response.data;
};

const getAllMyStores = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_URL + `/get/stores`, config);
    return response.data;
};

const chemistService = {
    createStoreChemist,
    getAllMyStores
};

export default chemistService;