import axios from "axios";

const API_URL = "http://localhost:5000/api/patient";

const addNewMed = async (medDetails, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.post(API_URL + "/create/meds", medDetails, config);
    return response.data;
};

const addNewMedByPhoto = async (medDetails, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.post(API_URL + "/create/meds/photo", medDetails, config);
    return response.data;
}

const patientService = {
    addNewMed,
    addNewMedByPhoto
};

export default patientService;