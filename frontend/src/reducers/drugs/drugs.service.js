import axios from "axios";

const API_URL = "http://localhost:5000/api/drug";

const getAllDrugsUser = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_URL + "/get/medicines", config);
    return response.data;
};

const deleteDrugsUser = async (token, id) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_URL + `/delete/medication/${id}`, config);
    return response.data;
}

const drugService = {
    getAllDrugsUser,
    deleteDrugsUser
};

export default drugService;