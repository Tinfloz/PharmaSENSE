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

const deleteMyStore = async (token, id) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_URL + `/delete/store/${id}`, config);
    return response.data;
};

const changeStoreName = async (token, name, id) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.post(API_URL + `/change/name/${id}`, name, config);
    return response.data;
};

const setStoreAddress = async (id, addressDetails, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.post(API_URL + `/change/address/${id}`, addressDetails, config);
    return response.data;
}

const chemistService = {
    createStoreChemist,
    getAllMyStores,
    deleteMyStore,
    changeStoreName,
    setStoreAddress
};

export default chemistService;