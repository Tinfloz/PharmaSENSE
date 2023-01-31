import axios from "axios"

const API_URL = "http://localhost:5000/api/user";

const register = async (creds) => {
    const response = await axios.post(API_URL + "/register", creds);
    if (response) {
        localStorage.setItem("user", JSON.stringify(response.data.sendUser));
    };
    return response.data;
};

const login = async (creds) => {
    const response = await axios.post(API_URL + "/login", creds);
    if (response) {
        localStorage.setItem("user", JSON.stringify(response.data.sendUser));
    };
    return response.data;
};

const setAddressUser = async (addressDetails, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.post(API_URL + "/set/address", addressDetails, config);
    const user = JSON.parse(localStorage.getItem("user"));
    const newLoginUser = {
        ...user.loginUser,
        "address": response.data.address
    };
    const newUser = {
        ...user,
        "loginUser": newLoginUser
    };
    localStorage.setItem("user", JSON.stringify(newUser));
    return response.data;
}

const userService = {
    register,
    login,
    setAddressUser
};

export default userService;