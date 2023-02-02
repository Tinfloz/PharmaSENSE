import axios from "axios";

const API_URL = "http://localhost:5000/api/delivery";

const getNearbyStoreDeliveries = async (id, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_URL + `/get/nearby/deliveries/${id}`, config);
    return response.data;
};

const getSelectedDelivery = async (id, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_URL + `/get/delivery/${id}`, config);
    return response.data;
};

const deliveryService = {
    getNearbyStoreDeliveries,
    getSelectedDelivery
};

export default deliveryService;